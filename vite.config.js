import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 后端接口基地址（只在这里配一处，改这里就能切换联调对象）
//
// 当前指向线上已部署的后端 https://bdis.work，
// 因为本地 Spring Boot 项目还没交给我们，指向线上才能真正联调真数据。
//
// 等负责人给了本地后端仓库、你把它跑起来之后，
// 把下面这一行改成 'http://localhost:8081' 即可，其余代码一行都不用动。
const API_TARGET = 'https://bdis.work'

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
    // 开发阶段把浏览器发出的 /api、/uploads、/static 请求转发给后端，
    // 彻底规避浏览器跨域（CORS）。生产环境由 Nginx 反向代理承担同样职责。
    proxy: {
      // 业务接口前缀
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        // 后端真实路径本身就带 /api，不要 rewrite 掉，否则会 404
      },
      // 上传 / 附件目录
      '/uploads': {
        target: API_TARGET,
        changeOrigin: true,
      },
      // 静态资源：封面图等路径形如 /static/news/news1.jpg，由后端目录提供
      '/static': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
})
