
import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download, Copy, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { generateImage, hasImageApiConfigured } from '../services/imageService';

const PRESETS = [
  '专业货运货代宣传图：远洋集装箱货轮停靠港口，清晨光线，商务摄影风格',
  '简洁商务邮件头图：蓝色货柜与地球航线，扁平插画，白底',
  '物流仓库内景：叉车与货架，现代化，写实风格',
  '跨境物流信息图风格：中国到海外航线地图，干净矢量风',
];

export const ModuleImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [size, setSize] = useState('2K');
  const [modelId, setModelId] = useState('wan2.7-image');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const configured = hasImageApiConfigured();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateImage(prompt, {
        size,
        n: 1,
        modelId,
        negativePrompt: negativePrompt || undefined,
      });
      setUrls(result.urls);
    } catch (e: any) {
      setError(e?.message || '生成失败');
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8 animate-fade-in">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <Sparkles className="text-blue-600" /> AI 文生图
        </h2>
        <p className="text-sm text-slate-400 font-bold mb-6">
          基于通义万相生成邮件配图、宣传图等素材。请先在管理后台配置文生图 API Key（可与百炼千问 Key 相同）。
        </p>

        {!configured && (
          <div className="mb-6 flex items-start gap-2 bg-amber-50 border border-amber-100 text-amber-800 px-4 py-3 rounded-xl text-sm font-bold">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            尚未检测到文生图密钥。请管理员在后台「API 密钥配置」中填写文生图 API Key 并保存。
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">图片描述 (Prompt)</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold resize-none"
              placeholder="描述你想生成的图片，例如：货代公司开发信头图，集装箱港口，专业商务风格..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPrompt(p)}
                className="text-[11px] font-bold bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-100 px-3 py-1.5 rounded-lg touch-manipulation"
              >
                {p.slice(0, 18)}…
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">负面提示（可选）</label>
            <input
              type="text"
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
              placeholder="不想出现的元素，例如：文字乱码、低清晰度、水印"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">分辨率</label>
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold bg-white"
              >
                <option value="1K">1K（更快）</option>
                <option value="2K">2K（推荐）</option>
                <option value="4K">4K（需 Pro 模型）</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">模型</label>
              <select
                value={modelId}
                onChange={e => setModelId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold bg-white"
              >
                <option value="wan2.7-image">wan2.7-image</option>
                <option value="wan2.7-image-pro">wan2.7-image-pro</option>
                <option value="wan2.6-image">wan2.6-image</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
            {loading ? '生成中…' : '开始生成'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      {urls.length > 0 && (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-800">生成结果</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urls.map((url, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                <img src={url} alt={`generated-${i}`} className="w-full object-contain max-h-[420px] bg-white" />
                <div className="p-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(url)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-black touch-manipulation"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? '已复制' : '复制链接'}
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-black touch-manipulation"
                  >
                    <Download size={14} /> 打开/下载
                  </a>
                </div>
                <p className="px-3 pb-3 text-[10px] text-slate-400 font-medium break-all">{url}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 font-bold">
            提示：可将图片链接粘贴到「邮件营销」模板编辑器的图片按钮中使用。
          </p>
        </div>
      )}
    </div>
  );
};
