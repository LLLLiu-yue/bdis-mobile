// 公告接口层（B 同学负责）
// 严格遵循接口文档：
//   P04 GET /api/announcements?page=&limit=&category  → 分页对象 { list, total, page, limit }
//   P05 GET /api/announcements/{id}                    → AnnouncementItem 或 null
// 注意：
//   - total 是总条数，不是总页数，总页数前端用 Math.ceil(total/limit) 计算
//   - “全部”分类：category 为 '' 时省略该参数，不发送单词 all
//   - 公告与新闻是两张表，即使数字相同也不是同一条，必须走各自接口

import { getData } from './http.js'

// 分类下拉/标签映射（接口值 → 展示文案）。
// 枚举值在实体中，后端未做严格校验，遇到未知值就显示原值，不强行映射。
export const ANNOUNCEMENT_CATEGORIES = [
  { value: '', label: '全部' },
  { value: 'recruit', label: '招新' },
  { value: 'activity', label: '活动' },
  { value: 'notice', label: '通知' },
  { value: 'contest', label: '竞赛' },
  { value: 'project_recruit', label: '项目招募' },
]

export function getAnnouncementList({ page = 1, limit = 10, category } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  // 只有选择了具体分类才发 category；“全部”一律省略
  if (category) {
    params.set('category', category)
  }
  return getData(`/api/announcements?${params.toString()}`)
}

export function getAnnouncementDetail(id) {
  return getData(`/api/announcements/${id}`)
}

// 把接口分类值转成展示文案，未知值原样返回
export function announcementCategoryLabel(value) {
  const found = ANNOUNCEMENT_CATEGORIES.find((item) => item.value === value)
  return found ? found.label : (value || '未分类')
}
