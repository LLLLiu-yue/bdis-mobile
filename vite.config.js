import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 开发阶段把浏览器发出的 /api、/uploads 请求转发到 Spring Boot 后端，
    // 彻底规避浏览器跨域（CORS）。生产环境由 Nginx 反向代理承担同样职责。
    proxy: {
      // 业务接口前缀
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        // 后端真实路径本身就带 /api，不要 rewrite 掉，否则会 404
      },
      // 上传 / 静态附件目录
      '/uploads': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
