import { env } from './env';
import { getApiConfig as getSupabaseApiConfig } from './supabase';

export interface ImageGenConfig {
  apiKey: string;
  baseUrl: string;
  modelId: string;
}

export interface ImageGenResult {
  urls: string[];
  raw?: unknown;
}

const DEFAULT_IMAGE_BASE = 'https://dashscope.aliyuncs.com';
const DEFAULT_IMAGE_MODEL = 'wan2.7-image';

const readLocal = (key: string) =>
  typeof localStorage !== 'undefined' ? localStorage.getItem(key)?.trim() || '' : '';

const sanitizeApiKey = (key: string): string =>
  key.replace(/[\s\u200B-\u200D\uFEFF]/g, '').trim();

const isTokenPlanBase = (url: string): boolean => /token-plan/i.test(url);

export const resolveImageGenConfig = async (override?: Partial<ImageGenConfig>): Promise<ImageGenConfig> => {
  const cloud = await getSupabaseApiConfig('image').catch(() => null);
  const apiKey = sanitizeApiKey(
    override?.apiKey
    || readLocal('trade_scout_image_api_key')
    || cloud?.apiKey
    || env.imageApiKey
    // 同属百炼 / Token Plan 时可复用千问 Key
    || readLocal('trade_scout_qwen_api_key')
    || env.qwenApiKey
    || ''
  );

  const rawBase =
    override?.baseUrl?.trim()
    || readLocal('trade_scout_image_base_url')
    || cloud?.baseUrl?.trim()
    // 未单独配文生图地址时，复用千问 Base（Token Plan 场景）
    || env.imageBaseUrl
    || readLocal('trade_scout_qwen_base_url')
    || env.qwenBaseUrl
    || DEFAULT_IMAGE_BASE;

  let baseUrl = rawBase.replace(/\/$/, '');
  if (baseUrl && !baseUrl.startsWith('http') && !baseUrl.startsWith('/')) {
    baseUrl = `https://${baseUrl}`;
  }

  const modelId =
    override?.modelId?.trim()
    || readLocal('trade_scout_image_model_id')
    || cloud?.modelId?.trim()
    || env.imageModelId
    || DEFAULT_IMAGE_MODEL;

  if (!apiKey) {
    throw new Error('未配置文生图 API Key（请在管理后台「文生图」栏填写，或复用已配置的千问/百炼 Key）');
  }

  if (apiKey.startsWith('sk-sp-') && !isTokenPlanBase(baseUrl)) {
    throw new Error(
      '检测到 Token Plan Key（sk-sp-），文生图 Base URL 请填写：https://token-plan.cn-beijing.maas.aliyuncs.com（或带 /compatible-mode/v1 亦可）'
    );
  }

  return { apiKey, baseUrl, modelId };
};

/** 开发环境走固定代理；Token Plan 绝不能落到 dashscope */
const effectiveImageApiRoot = (baseUrl: string): { root: string; via: string } => {
  const isDev =
    typeof window !== 'undefined'
    && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  let root = baseUrl.replace(/\/$/, '');
  // 去掉可能误填的 OpenAI / api 后缀，文生图走 DashScope 原生 multimodal 路径
  root = root.replace(/\/compatible-mode\/v1$/i, '').replace(/\/api\/v1$/i, '');

  if (isDev) {
    if (isTokenPlanBase(root)) {
      return { root: '/token-plan-api', via: 'token-plan' };
    }
    if (/dashscope\.aliyuncs\.com/i.test(root)) {
      return { root: '/dashscope-api', via: 'dashscope' };
    }
    // 其他 maas 工作空间：开发期暂无专用代理，直连（可能遇 CORS）
  }
  return { root, via: root };
};

/** Token Plan 文档用 1024*1024；百炼 wan2.7 也可用 1K/2K */
const mapImageSize = (size: string | undefined, tokenPlan: boolean): string => {
  const raw = (size || (tokenPlan ? '1024*1024' : '2K')).trim();
  if (!tokenPlan) return raw;
  const upper = raw.toUpperCase();
  if (upper === '1K' || upper === '1024') return '1024*1024';
  if (upper === '2K' || upper === '2048') return '2048*2048';
  if (raw.includes('*')) return raw;
  return '1024*1024';
};

const extractImageUrls = (data: any): string[] => {
  const urls: string[] = [];
  const push = (u?: string) => {
    if (u && typeof u === 'string' && !urls.includes(u)) urls.push(u);
  };

  const output = data?.output;
  if (output) {
    const choices = output?.choices;
    if (Array.isArray(choices)) {
      for (const c of choices) {
        const content = c?.message?.content;
        if (Array.isArray(content)) {
          for (const part of content) {
            push(part?.image || part?.image_url?.url || part?.url);
          }
        }
      }
    }
    if (Array.isArray(output?.results)) {
      for (const r of output.results) push(r?.url || r?.image);
    }
    push(output?.image_url);
    push(output?.url);
  }

  // OpenAI images 兼容结构（兜底）
  if (Array.isArray(data?.data)) {
    for (const item of data.data) {
      push(item?.url);
      if (item?.b64_json) push(`data:image/png;base64,${item.b64_json}`);
    }
  }

  return urls;
};

const parseApiError = (data: any, status: number, via: string): string => {
  const msg =
    data?.error?.message
    || data?.message
    || data?.code
    || (typeof data === 'string' ? data : JSON.stringify(data || {}).slice(0, 300));
  return `文生图失败 (${status}) via ${via}: ${msg}`;
};

/**
 * 通义万相文生图：
 * - Token Plan: POST {token-plan}/api/v1/services/aigc/multimodal-generation/generation
 * - 百炼按量:   POST {dashscope}/api/v1/services/aigc/multimodal-generation/generation
 */
export const generateImage = async (
  prompt: string,
  options: {
    size?: string;
    n?: number;
    modelId?: string;
    negativePrompt?: string;
    apiKey?: string;
    baseUrl?: string;
  } = {}
): Promise<ImageGenResult> => {
  const trimmed = prompt.trim();
  if (!trimmed) throw new Error('请输入图片描述');

  const config = await resolveImageGenConfig({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl,
    modelId: options.modelId,
  });
  const { root: apiRoot, via } = effectiveImageApiRoot(config.baseUrl);
  const tokenPlan = isTokenPlanBase(config.baseUrl) || via === 'token-plan';
  const url = `${apiRoot}/api/v1/services/aigc/multimodal-generation/generation`;

  const text = options.negativePrompt?.trim()
    ? `${trimmed}\n\n负面提示（避免出现）: ${options.negativePrompt.trim()}`
    : trimmed;

  const parameters: Record<string, unknown> = {
    size: mapImageSize(options.size, tokenPlan),
    n: options.n ?? 1,
    watermark: false,
  };
  // thinking_mode 主要为百炼 wan 参数；Token Plan 文档未要求，避免多余字段
  if (!tokenPlan) {
    parameters.thinking_mode = false;
  }

  console.log('[ImageGen]', { url, via, modelId: config.modelId, keyPrefix: config.apiKey.slice(0, 6) });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.modelId,
      input: {
        messages: [
          {
            role: 'user',
            content: [{ text }],
          },
        ],
      },
      parameters,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseApiError(data, response.status, via));
  }

  const urls = extractImageUrls(data);
  if (urls.length === 0) {
    throw new Error('文生图成功但未返回图片地址，请检查模型是否支持文生图（如 wan2.7-image）');
  }

  return { urls, raw: data };
};

export const testImageApiKey = async (
  apiKey: string,
  baseUrl?: string,
  modelId?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanKey = sanitizeApiKey(apiKey);
    if (!cleanKey) return { success: false, message: '请填写文生图 API Key' };
    const cleanBase = (baseUrl || '').trim();
    await generateImage('蓝色货柜图标，白底扁平插画', {
      size: '1K',
      n: 1,
      apiKey: cleanKey,
      baseUrl: cleanBase || undefined,
      modelId: modelId?.trim() || DEFAULT_IMAGE_MODEL,
    });
    return {
      success: true,
      message: `文生图连接成功 ✅（Key ${cleanKey.slice(0, 6)}… 长度${cleanKey.length}；模型 ${modelId || DEFAULT_IMAGE_MODEL}）`,
    };
  } catch (e: any) {
    return { success: false, message: e?.message || '测试失败' };
  }
};

export const hasImageApiConfigured = (): boolean => {
  if (env.imageApiKey) return true;
  if (readLocal('trade_scout_image_api_key')) return true;
  if (env.qwenApiKey || readLocal('trade_scout_qwen_api_key')) return true;
  return false;
};
