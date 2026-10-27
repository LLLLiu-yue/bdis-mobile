// 学习资料接口层（A 同学负责）
//
// 真实接口（已验证）：
//   GET /api/resources?page=1&limit=10&category=frontend
//   → { total, limit, page, list: [...] }
//
// 字段名：id / title / description / category / link / sortOrder
// 注意两点：
//   1. 后端的 category **真实支持**过滤（实测 category=frontend 返回 total=4），
//      所以分类切换走后端查询，不在前端做假筛选
//   2. 本模块**没有正文 / 详情字段**，所以不建详情页，列表直接跳外链
//
// 路径统一写在 api 层，页面里不出现任何 URL。

import { getData } from './http.js'

export const PAGE_SIZE = 10

// 分类字典：只列线上真实存在且有数据的分类（course 实测 total=0，故不列入，
// 避免出现“点了显示空列表”的按钮）
export const RESOURCE_CATEGORIES = [
  { key: '', label: '全部' },
  { key: 'frontend', label: '前端' },
  { key: 'backend', label: '后端' },
  { key: 'database', label: '数据库' },
  { key: 'ai', label: '人工智能' },
  { key: 'tools', label: '工具' },
]

export function getResourceList({ page = 1, limit = PAGE_SIZE, category = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  // “全部”不传 category，让后端走默认分支
  if (category) params.set('category', category)
  return getData(`/api/resources?${params.toString()}`)
}

export function categoryText(key) {
  const hit = RESOURCE_CATEGORIES.find((item) => item.key === key)
  return hit ? hit.label : key || '资料'
}

/**
 * 只放行 http / https 外链
 * 其他协议（javascript:、data: 等）一律拒绝，返回空串由页面降级为纯文字，
 * 绝不渲染成一个点了没反应的假链接
 */
export function safeHttpUrl(url) {
  if (!url) return ''
  const value = String(url).trim()
  return /^https?:\/\//i.test(value) ? value : ''
}
