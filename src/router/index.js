import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes.js'

const BASE_TITLE = '大数据智能工作室'

const router = createRouter({
  // 首版固定使用 Hash 模式：静态托管不需要额外的服务端回退配置，局域网真机调试也稳定
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 页面内部有独立的滚动容器（见 MobileLayout），这里主要服务浏览器前进/后退
    return savedPosition || { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title =
    !title || title === BASE_TITLE ? `${BASE_TITLE} · BDIS` : `${title} · ${BASE_TITLE}`
})

router.onError((error) => {
  console.error('[router] 页面资源加载失败：', error)
})

export default router
