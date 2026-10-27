// 项目接口层（A 同学负责）
//
// 真实接口（已用线上后端逐个验证）：
//   GET /api/projects/progress → 项目**列表**，直接返回数组
//   GET /api/projects/{id}     → 项目详情对象；不存在时后端 data 为 null
//
// 三个必须记住的坑：
//   1. 列表接口是 /projects/progress，**不是** /projects（单独请求 /api/projects 会 404）
//   2. 项目主键是**字符串**（如 p-001），全程不能 Number(id)
//   3. 详情返回的字段和列表**完全一样**，项目没有正文 / 长介绍字段，
//      所以详情页不许虚构 description、content 这类字段
//
// 路径统一写在 api 层，页面里不出现任何 URL。

import { getData } from './http.js'

export function getProjectList() {
  return getData('/api/projects/progress')
}

export function getProjectDetail(id) {
  // id 原样传字符串，不要 Number(id)
  return getData(`/api/projects/${id}`)
}

// 后端状态取值目前只有 ongoing / recruiting 两种（真实数据核对过）
const STATUS_TEXT = {
  ongoing: '进行中',
  recruiting: '招募中',
  completed: '已完成',
  planning: '筹备中',
}

export function statusText(status) {
  // 取不到时回退原值而不是写死“未知”，避免把真实状态遮掉
  return STATUS_TEXT[status] || status || '进行中'
}

// 后端已有 ongoing/recruiting 之外的招募含义集中在 recruiting，
// 这里只需要判断“是否在招募”，用于列表筛选高亮
export function isRecruiting(status) {
  return status === 'recruiting'
}

// 无意义值：后端在“没有招募角色”时会填 "无"，展示成标签会很怪，统一过滤
const EMPTY_WORDS = new Set(['无', '暂无', '-', '—', 'null', 'undefined'])

/**
 * 取出角色 / 成员标签数组
 *
 * 后端很贴心地同时返回了两种形式：
 *   recruitRoles: "丁祎,郭敦权"        字符串形式
 *   recruitRolesArray: ["丁祎","郭敦权"] 数组形式
 * 优先用数组形式（省一次切分，也不会因为中英文逗号出错）；
 * 万一以后后端不再返回 Array 字段，再退化成切字符串兜底。
 */
export function pickTags(item, key) {
  if (!item) return []

  const arr = item[`${key}Array`]
  if (Array.isArray(arr)) {
    return arr.map((it) => String(it).trim()).filter((it) => it && !EMPTY_WORDS.has(it))
  }

  const raw = item[key]
  if (raw == null || raw === '') return []
  // 兼容英文逗号、中文逗号、顿号
  return String(raw)
    .split(/[,，、]/)
    .map((it) => it.trim())
    .filter((it) => it && !EMPTY_WORDS.has(it))
}

// 进度值收敛到 0~100，防止后端返回异常值把进度条撑破布局
export function normalizeProgress(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.min(100, Math.max(0, Math.round(num)))
}
