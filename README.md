# bdis-mobile

大数据智能工作室（BDIS）官网**移动端**。

Vue 3 + Vite + Vue Router（Hash 模式），无 TypeScript、无 UI 组件库，
全部样式手写，网络请求只用原生 `fetch` 封装一层 `getData()`。

---

## 一、当前进度

**四大业务模块全部完成并接通真实后端接口**（非 mock、非假数据）。

| 模块 | 页面 | 负责人 | 数据接口 |
| :--- | :--- | :--- | :--- |
| 新闻 | 列表（动态页 tab）、详情 | A | `/api/news`、`/api/news/{id}` |
| 公告 | 列表（动态页 tab）、详情 | B | `/api/announcements`、`/api/announcements/{id}` |
| 项目 | 列表、详情 | A | `/api/projects/progress`、`/api/projects/{id}` |
| 学习资料 | 列表 | A | `/api/resources` |
| 竞赛招募 | 列表、详情 | B | `/api/platform/forum`、`/api/platform/forum/{id}` |
| 首页 | 轮播 + 实验室信息 + 最新动态 | B | `/api/banner`、`/api/lab/info`、`/api/news` |
| 关于我们 | 实验室简介 + 团队成员 | B | `/api/lab/info`、`/api/lab/team` |

进度台账详见 [`docs/开发进度.md`](docs/开发进度.md)。

> **本期明确不做的范围**（均已做成说明卡，不含假数据、不含点了没反应的假按钮）：
> 在线投递（`/join`）、全站搜索（`/search`）、成长路线（`/growth`）。
> 三者的原因是：依赖的 POST / 检索接口未提供，或内容来源尚未确认。

---

## 二、本地运行

```bash
npm ci
npm run dev                     # 本机预览
npm run dev -- --host 0.0.0.0   # 局域网内真机调试
npm run build                   # 生产构建，产物在 dist/
```

Node 版本要求见 `package.json` 的 `engines` 字段。

### 后端地址配置

开发期的接口地址集中在 `vite.config.js` 的常量里：

```js
const API_TARGET = 'https://bdis.work'   // ← 改这一行即可切换后端
```

所有代理规则（`/api`、`/uploads`、`/static`）共用它，不需要逐条改。
页面代码里**只写 `/api/...` 相对路径**，不出现任何 baseURL，避免出现 `/api/api/` 重复前缀。

---

## 三、目录结构

```text
src/
  api/          请求层：每个模块一个文件，所有 URL 只出现在这里
     http.js              getData() 封装：HTTP 层 + 业务层双校验
     news.js  announcements.js  projects.js  resources.js
     competitions.js  home.js  lab.js
  components/   PageHeader / BottomNav / RequestState / NewsPanel / AnnouncementPanel
  layouts/      MobileLayout（上下固定、中间独立滚动）
  router/       index.js（路由器） + routes.js（路由表）
  views/        14 个路由节点对应的页面
  style.css     全局基础样式与设计变量
docs/
  开发进度.md    进度台账（含 PR 链接与遗留问题）
```

**分层约定**：页面不直接发请求，必须经过 `src/api/*.js`；
所有列表/详情都用 `RequestState` 组件承载四态（`loading` / `error+重试` / `empty` / `normal`）。

---

## 四、路由清单

| 路径 | 页面 | 底部导航高亮 |
| :--- | :--- | :--- |
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

> 404 兜底路由**必须放在路由表最后**，否则会劫持其他路径。

---

## 五、开发约定（踩过的坑）

- **ID 全程保持字符串**：项目主键是 `p-001`，组队主键是 `demo-forum-001`，
  任何地方都不得 `Number(id)` / `parseInt`，否则查不到数据。
- **详情页必须监听路由参数**：从 `/news/1` 切到 `/news/2` 时组件不会重新挂载，
  只写 `onMounted` 会一直停在第一条，必须用 `watch(() => route.params.id, load, { immediate: true })`。
- **富文本字段用 `v-html`**：新闻与公告的 `content` 存的是 HTML，
  插值渲染会把标签当正文打印出来。
- **字段命名优先驼峰**：后端实际返回 `publishDate` / `coverThumbUrl` 这类驼峰名，
  蛇形写法只作兜底，不能反过来。
- **图片路径是 `/static/...`**：开发代理已配置，缺少它会静默 404（图裂了却不报错）。
- **禁止假数据与假按钮**：没数据的地方显示说明文案，不可用的按钮加 `disabled`，
  不出现"看着能点但点了没反应"的元素。
- **禁止 `overflow-x: hidden` 掩盖溢出**：需要必测 320 / 375 / 390 / 430 四档宽度。

---

## 六、协作流程

Issue → 分支（`feature/*` 前缀）→ PR → **至少 1 人 Approve** → Squash and merge → 删除远程分支。
`main` 为保护分支，禁止直接推送。
CI（GitHub Actions）会对每个 PR 跑 `npm ci && npm run build`，绿勾方可合并。
