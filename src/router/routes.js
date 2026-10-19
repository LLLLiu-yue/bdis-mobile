import MobileLayout from '@/layouts/MobileLayout.vue'

/**
 * 第一期路由清单（13 个业务节点 + 1 个 404 兜底）
 *
 * meta.title   顶部栏标题，同时用于 document.title
 * meta.navKey  底部导航高亮项：home / updates / projects / resources / more
 * meta.back    次级页面是否显示返回按钮
 * meta.backTo  直接打开深链接、站内没有上一条记录时的返回落点
 */

// 底部导航直接对应的四个主入口
const tabRoutes = [
  {
    path: '',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '大数据智能工作室', navKey: 'home' },
  },
  {
    path: 'updates',
    name: 'updates',
    component: () => import('@/views/UpdatesView.vue'),
    meta: { title: '动态', navKey: 'updates' },
  },
  {
    path: 'projects',
    name: 'projects',
    component: () => import('@/views/ProjectListView.vue'),
    meta: { title: '项目', navKey: 'projects' },
  },
  {
    path: 'resources',
    name: 'resources',
    component: () => import('@/views/ResourceListView.vue'),
    meta: { title: '学习资料', navKey: 'resources' },
  },
]

// 从列表页进入的详情页
const detailRoutes = [
  {
    path: 'news/:id',
    name: 'news-detail',
    component: () => import('@/views/NewsDetailView.vue'),
    meta: { title: '新闻详情', navKey: 'updates', back: true, backTo: '/updates' },
  },
  {
    path: 'announcements/:id',
    name: 'announcement-detail',
    component: () => import('@/views/AnnouncementDetailView.vue'),
    meta: { title: '公告详情', navKey: 'updates', back: true, backTo: '/updates' },
  },
  {
    path: 'projects/:id',
    name: 'project-detail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { title: '项目详情', navKey: 'projects', back: true, backTo: '/projects' },
  },
  {
    path: 'competitions',
    name: 'competitions',
    component: () => import('@/views/CompetitionListView.vue'),
    meta: { title: '竞赛招募', navKey: 'projects', back: true, backTo: '/projects' },
  },
  {
    path: 'competitions/:id',
    name: 'competition-detail',
    component: () => import('@/views/CompetitionDetailView.vue'),
    meta: { title: '竞赛详情', navKey: 'projects', back: true, backTo: '/competitions' },
  },
]

// “更多”面板里的二级页面
const moreRoutes = [
  {
    path: 'about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于我们', navKey: 'more', back: true, backTo: '/' },
  },
  {
    path: 'join',
    name: 'join',
    component: () => import('@/views/JoinView.vue'),
    meta: { title: '加入我们', navKey: 'more', back: true, backTo: '/' },
  },
  {
    path: 'search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: '全局搜索', navKey: 'more', back: true, backTo: '/' },
  },
  {
    path: 'growth',
    name: 'growth',
    component: () => import('@/views/GrowthView.vue'),
    meta: { title: '成长路线', navKey: 'more', back: true, backTo: '/' },
  },
]

// 必须放在最后：任何未匹配路径都落到 404 页
const fallbackRoutes = [
  {
    path: ':pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在', navKey: '' },
  },
]

export const routes = [
  {
    path: '/',
    component: MobileLayout,
    children: [...tabRoutes, ...detailRoutes, ...moreRoutes, ...fallbackRoutes],
  },
]

export default routes
