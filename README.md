# bdis-mobile

大数据智能工作室官网移动端（Vue 3 + Vite + Vue Router，Hash 模式）。

## 本地运行

```bash
npm ci
npm run dev          # 本机预览
npm run dev -- --host 0.0.0.0   # 局域网真机调试
npm run build
```

Node 版本要求见 `package.json` 的 `engines` 字段。

## 目录约定

```text
src/
  components/   PageHeader / BottomNav / RequestState
  layouts/      MobileLayout（上下固定、中间独立滚动）
  router/       index.js（路由器） + routes.js（路由表）
  views/        14 个路由节点对应的页面
  style.css     全局基础样式与设计变量
```

## 路由清单

| 路径 | 页面 | 底部导航高亮 |
| --- | --- | --- |
| `/` | 首页 | 首页 |
| `/updates` | 动态（新闻与公告） | 动态 |
| `/news/:id` | 新闻详情 | 动态 |
| `/announcements/:id` | 公告详情 | 动态 |
| `/projects` | 项目列表 | 项目 |
| `/projects/:id` | 项目详情 | 项目 |
| `/competitions` | 竞赛招募列表 | 项目 |
| `/competitions/:id` | 竞赛招募详情 | 项目 |
| `/resources` | 学习资料 | 资料 |
| `/about` | 关于我们 | 更多 |
| `/join` | 加入说明 | 更多 |
| `/search` | 全局搜索 | 更多 |
| `/growth` | 成长路线（预留） | 更多 |
| `/:pathMatch(.*)*` | 404 兜底 | 无 |

## 布局说明

- `MobileLayout` 用 Flex 三段式：头部与底部导航固定，中间内容区 `flex: 1` + `min-height: 0` 独立滚动，正文不会被底部导航遮挡。
- 底部导航为 56px + `env(safe-area-inset-bottom)`，兼容 iPhone 底部手势条；`index.html` 已开启 `viewport-fit=cover`。
- 全站按 320px 起做单列流式排版：网格统一 `minmax(0, 1fr)`，长文本 `overflow-wrap: anywhere`，不使用 `overflow-x: hidden` 掩盖溢出。
- 当前为 T02 骨架阶段，各页面只展示结构占位，真实接口在后续 PR 接入。
