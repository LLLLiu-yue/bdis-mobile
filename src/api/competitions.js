// 竞赛组队接口层（B 同学负责）
//
// 真实接口（已线上逐个请求验证）：
//   GET /api/platform/forum       → 竞赛/组队列表，返回数组
//   GET /api/platform/forum/{id}  → 组队详情对象；不存在时 data 为 null
//
// 注意（实测结论，别踩）：
//   - /api/competitions、/api/forum、/api/competition/{id} 实测全是 404，不要换路径
//   - 列表没有 page / limit / total，不要硬传分页参数
//   - 线上真实字段（驼峰）：id / title / category / summary / content /
//     publisher / publishDate / link / coverThumbUrl / sortOrder
//   - content 是富文本 HTML，详情页必须 v-html 渲染
//   - id 是字符串主键（如 demo-forum-001），全程保持字符串，不 Number()
//   - 列表当前线上为空数组：这是后端未录入数据的正常业务态，
//     页面要走「暂无数据」空态，不是报错
//
// 路径统一写在 api 层，页面里不出现任何 URL。

import { getData } from './http.js'

export function getCompetitionList() {
  return getData('/api/platform/forum')
}

export function getCompetitionDetail(id) {
  // id 原样传字符串，不要 Number(id)
  return getData(`/api/platform/forum/${id}`)
}

// 分类文案：线上暂无数据、取值未知，未知值原样展示；
// 不写死映射表，避免以后后端加新分类时前端漏显
export function categoryText(category) {
  return category || '组队'
}
