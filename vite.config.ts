
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const pick = (...keys: string[]) => keys.map(k => env[k] || '').find(Boolean) || '';

  return {
    plugins: [react()],
    build: {
      sourcemap: false,
      minify: 'esbuild',
    },
    server: {
      proxy: {
        // 开发环境代理：按路径固定目标主机（Vite router 对自定义 Header 不可靠）
        // Token Plan 个人版 / 团队版
        '/token-plan-api': {
          target: 'https://token-plan.cn-beijing.maas.aliyuncs.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/token-plan-api/, ''),
        },
        // 按量付费 DashScope / 通用百炼
        '/qwen-api': {
          target: (() => {
            const raw = env.REACT_APP_QWEN_BASE_URL || '';
            try {
              if (raw && !/token-plan/i.test(raw)) return new URL(raw).origin;
            } catch {
              /* fall through */
            }
            return 'https://dashscope.aliyuncs.com';
          })(),
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/qwen-api/, ''),
        },
        '/dashscope-api': {
          target: 'https://dashscope.aliyuncs.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/dashscope-api/, ''),
        },
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(pick('API_KEY', 'REACT_APP_GEMINI_API_KEY')),
      'process.env.REACT_APP_GEMINI_API_KEY': JSON.stringify(pick('REACT_APP_GEMINI_API_KEY', 'API_KEY')),
      'process.env.REACT_APP_QWEN_API_KEY': JSON.stringify(env.REACT_APP_QWEN_API_KEY || ''),
      'process.env.REACT_APP_QWEN_BASE_URL': JSON.stringify(env.REACT_APP_QWEN_BASE_URL || ''),
      'process.env.REACT_APP_QWEN_MODEL': JSON.stringify(env.REACT_APP_QWEN_MODEL || env.REACT_APP_QWEN_MODEL_ID || ''),
      'process.env.REACT_APP_IMAGE_API_KEY': JSON.stringify(env.REACT_APP_IMAGE_API_KEY || env.REACT_APP_WANX_API_KEY || ''),
      'process.env.REACT_APP_IMAGE_BASE_URL': JSON.stringify(env.REACT_APP_IMAGE_BASE_URL || env.REACT_APP_WANX_BASE_URL || ''),
      'process.env.REACT_APP_IMAGE_MODEL': JSON.stringify(env.REACT_APP_IMAGE_MODEL || env.REACT_APP_WANX_MODEL || ''),
      'process.env.REACT_APP_DEFAULT_AI_MODEL': JSON.stringify(env.REACT_APP_DEFAULT_AI_MODEL || 'auto'),
      'process.env.HUNTER_API_KEY': JSON.stringify(pick('HUNTER_API_KEY', 'REACT_APP_HUNTER_API_KEY')),
      'process.env.REACT_APP_HUNTER_API_KEY': JSON.stringify(pick('REACT_APP_HUNTER_API_KEY', 'HUNTER_API_KEY')),
      'process.env.FINDYMAIL_API_KEY': JSON.stringify(env.FINDYMAIL_API_KEY || ''),
      'process.env.ANYMAIL_FINDER_API_KEY': JSON.stringify(env.ANYMAIL_FINDER_API_KEY || ''),
      'process.env.VITE_GITHUB_TOKEN': JSON.stringify(env.VITE_GITHUB_TOKEN || ''),
      'process.env.VITE_GITHUB_OWNER': JSON.stringify(env.VITE_GITHUB_OWNER || ''),
      'process.env.VITE_GITHUB_REPO': JSON.stringify(env.VITE_GITHUB_REPO || ''),
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(env.REACT_APP_SUPABASE_URL || ''),
      'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(env.REACT_APP_SUPABASE_ANON_KEY || ''),
    }
  }
})
