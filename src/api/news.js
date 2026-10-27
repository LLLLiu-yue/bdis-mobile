// 新闻接口层（A 同学负责）
// 严格遵循接口约定：
//   GET /api/news?limit=10   → 新闻列表
//   GET /api/news/{id}       → 新闻详情对象；不存在时后端 data 为 null
//
// 注意：
//   - 新闻接口只支持 limit，**没有 page 分页**，不要硬传 page（与公告不同）
//   - 新闻与公告是两张表，即使 id 数字相同也不是同一条，必须各走各的接口
//   - 所有请求走相对路径 /api/...，代理已在 vite.config.js 配好，
//     绝不要在代码里写死 http://localhost:8081（手机真机会连不上）

import { getData } from './http.js'

// 分类文案字典：线上真实取值有 activity / recruit / project_recruit。
// 前端只做展示层的中文化，不影响查询逻辑
const CATEGORY_TEXT = {
  activity: '活动',
  recruit: '招新',
  project_recruit: '项目招募',
  research: '科研',
  award: '获奖',
}

export function categoryText(category) {
  // 取不到时回退成“新闻”，避免把英文原始值直接丢给用户看
  return CATEGORY_TEXT[category] || category || '新闻'
}

export function getNewsList(limit = 10) {
  return getData(`/api/news?limit=${limit}`)
}

export function getNewsDetail(id) {
  // id 原样传字符串，不要 Number(id)
  return getData(`/api/news/${id}`)
}