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
npm run dev                     # 本机预览，默认 http://localhost:5173
npm run dev -- --host 0.0.0.0   # 局域网内真机调试
npm run build                   # 生产构建，产物在 dist/
npm run preview                 # 预览 dist/ 构建产物
```

环境要求：**Node 22.x**（见 `package.json` 的 `engines` 字段，CI 同样用 Node 22）。
依赖安装必须用 `npm ci`（仓库已提交 `package-lock.json`），避免版本漂移。

### 后端地址配置

开发期的接口地址集中在 `vite.config.js` 顶部一个常量里：

```js
const API_TARGET = 'https://bdis.work'   // ← 改这一行即可切换后端
```

所有代理规则（`/api`、`/uploads`、`/static`）共用它，不需要逐条改。
接本地 Spring Boot 时把它改成 `http://localhost:8081`（端口按实际改）即可，**其余代码一行都不用动**。

页面代码里**只写 `/api/...` 相对路径**，不出现任何 baseURL，避免出现 `/api/api/` 重复前缀。

---

## 三、部署与整合

> 这一节是给整合方看的。前端是纯静态产物，**不含任何服务端逻辑**，
> 只要把 `dist/` 发出去、再把三类请求指到后端即可。

### 3.1 构建

```bash
npm ci
npm run build      # 产物目录 dist/，含 index.html + assets/（带 hash 文件名）
```

产物可以直接被任意静态服务器托管（Nginx / Spring Boot `static/` / 对象存储均可）。

**部署到子路径时**：本项目 `base` 默认为 `/`。
若托管地址形如 `https://example.com/mobile/`，需在 `vite.config.js` 的 `defineConfig` 里补一行：

```js
export default defineConfig({
  base: '/mobile/',     // ← 只在子路径部署时才需要
  ...
})
```

### 3.2 Nginx（前后端分离部署，推荐）

```nginx
server {
  listen 80;
  server_name bdis.example.com;

  # 前端静态产物
  location / {
    root   /var/www/bdis-mobile/dist;
    index  index.html;
    try_files $uri $uri/ /index.html;   # 本项目用 hash 路由，此项仅兜底
  }

  # 业务接口（后端真实路径本身带 /api，转发时不要把它剥掉）
  location /api/ {
    proxy_pass http://127.0.0.1:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # 静态资源：封面图等，路径形如 /static/news/news1.jpg
  location /static/ {
    proxy_pass http://127.0.0.1:8081;
  }

  # 上传 / 附件目录
  location /uploads/ {
    proxy_pass http://127.0.0.1:8081;
  }
}
```

**注意**：`/api`、`/uploads`、`/static` 三个前缀缺一不可。
少了 `/static` 的典型症状是——**页面不报错，但封面图全部裂图**。

### 3.3 Spring Boot 同域部署

把 `dist/` 内的所有文件拷进后端的 `src/main/resources/static/` 即可，
同源同端口，**不需要任何代理与跨域配置**，也不需要 Nginx。
（若同域部署下后端已有 `/api` 之外的静态目录冲突，改用 3.2 方案。）

### 3.4 联调参考

线上已有一个可对照的实例：**`https://bdis.work`**。
当前 `API_TARGET` 直接指向它，因此 `npm run dev` 起开就有真实数据，无需先跑本地后端。

---

## 四、后端接口契约

### 4.1 统一响应包络

```json
{ "code": 0, "message": "ok", "data": {} }
```

前端的双校验规则：先看 HTTP 状态码（`response.ok`），再看 `code !== 0` 视为业务失败。
`code !== 0` 时展示 `message` 并提供重试按钮。

> **例外**：查询不存在的资源时，后端返回 Spring 默认错误体
> `{timestamp, status, error, path}`（**不是**上面的统一包络）。
> 前端已对这个分支做兜底，会走「空态」而不是报错页。

### 4.2 各接口返回形态

| 接口 | 返回形态 |
| :--- | :--- |
| `/api/news` | **数组**，无分页字段 |
| `/api/news/{id}` | 单个对象；`content` 为 HTML 富文本 |
| `/api/announcements` | `{ total, limit, page, list }` |
| `/api/announcements/{id}` | 单个对象；`content` 为 HTML 富文本 |
| `/api/projects/progress` | 项目列表（注意：**单独的 `/api/projects` 是 404**） |
| `/api/projects/{id}` | 单个对象，字段与列表一致 |
| `/api/resources` | `{ total, limit, page, list }` |
| `/api/platform/forum` | 竞赛招募 / 组队列表 |
| `/api/platform/forum/{id}` | 单个对象 |
| `/api/lab/info`、`/api/lab/team` | 对象 / 数组 |
| `/api/banner` | 轮播图（**单数 banner，不是 banners**） |
| `/api/search?q=` | 搜索，参数是 **`q`**（不是 `keyword`） |

### 4.3 字段命名

接口返回的字段名是**小驼峰**，与数据库列名不同。前端统一写成「驼峰优先 + 蛇形兜底」：

| 数据库列名 | 接口字段名 |
| :--- | :--- |
| `publish_date` | `publishDate` |
| `cover_thumb_url` | `coverThumbUrl` |
| `sort_order` | `sortOrder` |
| `avatar_url` | `avatarUrl` |
| `updated_at` | `updatedAt` |

### 4.4 需要后端留意的点

1. **主键是字符串**：`project` 用 `p-001`、`demo-project-001`，`forum` 用 `demo-forum-001`。
   前端全程按字符串处理，若后续改成自增数字也无影响，但**不要中途混合类型**。
2. **`content` 字段是 HTML 富文本**：前端用 `v-html` 渲染。
   目前只有管理员能写入，风险可控；**一旦开放用户投稿，必须先做 HTML 清洗**。
3. **封面图路径前缀是 `/static/`**（少数为 `/api/uploads/`），两种都要能被访问到。
4. **`/api/platform/forum` 目前返回空数组**：前端已做空态说明卡，演示时页面不会出错，
   但如果能补 2~3 条组队/竞赛演示数据，录屏效果会更完整。
5. **后台管理（登录、新闻/公告增删改、富文本编辑、简历投递管理）本期不在范围内**，前端未实现。

---

## 五、目录结构

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
.github/workflows/build.yml   PR / push 时自动 npm ci && npm run build
```

**分层约定**：页面不直接发请求，必须经过 `src/api/*.js`；
所有列表/详情都用 `RequestState` 组件承载四态（`loading` / `error+重试` / `empty` / `normal`）。

---

## 六、路由清单

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
> 采用 Hash 模式（`createWebHashHistory`），同域部署到任意子目录都不会出现刷新 404。

---

## 七、开发约定（踩过的坑）

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

## 八、协作流程

Issue → 分支（`feature/*` 前缀）→ PR → **至少 1 人 Approve** → Squash and merge → 删除远程分支。
`main` 为保护分支，禁止直接推送。
CI（GitHub Actions）会对每个 PR 跑 `npm ci && npm run build`，绿勾方可合并。

---

## 九、成员分工

| 成员 | GitHub | 负责模块 |
| :--- | :--- | :--- |
| A | `LLLLiu-yue` | 新闻、项目、学习资料 |
| B | `shiling207` | 公告、首页轮播、关于我们、竞赛招募 |
