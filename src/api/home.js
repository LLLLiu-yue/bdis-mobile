// 首页接口层（B 同学负责）
//
// 真实接口（已线上逐个请求验证）：
//   GET /api/banner → 首页轮播图数组
//
// 注意（实测结论，别踩）：
//   - 是单数 banner；/api/banners 实测 404，不要写成复数
//   - 线上真实字段（驼峰）：id / title / subtitle / description /
//     buttonText / buttonLink / imageUrl / sortOrder / active
//   - buttonLink 是桌面端站内路径（如 /project/award/2025），与本站 hash
//     路由对不上，直接跳会 404 —— 首页只做展示，不渲染这个按钮，
//     避免出现「点了没反应/点了 404」的假按钮
//   - imageUrl 形如 /static/banners/banner2.png，/static 代理已配好
//
// 路径统一写在 api 层，页面里不出现任何 URL。

import { getData } from './http.js'

export function getBanners() {
  return getData('/api/banner')
}

/**
 * 防御性归一化：约定返回数组，若以后改成 { list } 也能兼容；
 * 只保留 active 的项，并按 sortOrder 升序排列
 */
export function normalizeBanners(data) {
  const list = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : []
  return list
    .filter(
      (item) =>
        item && (item.active === undefined || item.active === 1 || item.active === true),
    )
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
}
