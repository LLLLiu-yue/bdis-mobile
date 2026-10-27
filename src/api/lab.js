// 实验室信息接口层（B 同学负责）
//
// 真实接口（已线上逐个请求验证）：
//   GET /api/lab/info → 实验室信息对象（单个）
//   GET /api/lab/team → 团队成员数组
//
// 注意（实测结论，别踩）：
//   - 字段是驼峰：name / labDesc / nameEn / introShort / address / email /
//     qqGroup / logoUrl / picture；成员：name / role / description / avatarUrl
//   - labDesc 是带 \n 换行的纯文本（不是 HTML），渲染用 white-space: pre-line，
//     不要用 v-html
//   - 线上演示数据里 address / email / qqGroup / logoUrl / picture 全是 null，
//     约一半成员的 avatarUrl / role / description 是空串：
//     页面必须 v-if 兜底，不许出现「QQ群：」这种空标签和灰色裂图
//
// 路径统一写在 api 层，页面里不出现任何 URL。

import { getData } from './http.js'

export function getLabInfo() {
  return getData('/api/lab/info')
}

export function getLabTeam() {
  return getData('/api/lab/team')
}
