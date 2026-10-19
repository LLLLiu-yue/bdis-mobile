<script setup>
const quickLinks = [
  { to: '/updates', title: '动态', desc: '新闻与公告' },
  { to: '/projects', title: '项目', desc: '在研与招募' },
  { to: '/resources', title: '资料', desc: '课程与工具' },
  { to: '/search', title: '搜索', desc: '全站检索' },
]

// 骨架阶段的临时自检清单：联调开始后整块删除
const routeChecklist = [
  { to: '/', label: '/' },
  { to: '/updates', label: '/updates' },
  { to: '/news/1', label: '/news/:id' },
  { to: '/announcements/1', label: '/announcements/:id' },
  { to: '/projects', label: '/projects' },
  { to: '/projects/1', label: '/projects/:id' },
  { to: '/competitions', label: '/competitions' },
  { to: '/competitions/1', label: '/competitions/:id' },
  { to: '/resources', label: '/resources' },
  { to: '/about', label: '/about' },
  { to: '/join', label: '/join' },
  { to: '/search', label: '/search' },
  { to: '/growth', label: '/growth' },
  { to: '/no-such-page', label: '/:pathMatch(.*)*' },
]
</script>

<template>
  <div class="page">
    <section class="hero">
      <span class="hero__tag">BDIS</span>
      <h2 class="hero__title">大数据智能工作室</h2>
      <p class="hero__desc">
        移动端骨架已经就位。实验室简介、主视觉与最新动态会在接口联调后陆续填充。
      </p>
      <div class="hero__actions">
        <RouterLink class="btn hero__btn hero__btn--solid" to="/updates">看看动态</RouterLink>
        <RouterLink class="btn hero__btn hero__btn--outline" to="/about">了解我们</RouterLink>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">快捷入口</h2>
      </div>
      <ul class="tile-grid">
        <li v-for="link in quickLinks" :key="link.to">
          <RouterLink class="tile" :to="link.to">
            <span class="tile__title">{{ link.title }}</span>
            <span class="tile__desc">{{ link.desc }}</span>
            <span class="tile__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">最新动态</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card">
        <div class="ghost-list" aria-hidden="true">
          <div v-for="n in 3" :key="n" class="ghost-row">
            <span class="ghost-thumb" />
            <span class="ghost-body">
              <span class="skeleton-line" :style="{ width: n === 2 ? '72%' : '88%' }" />
              <span class="skeleton-line skeleton-line--soft" :style="{ width: '46%' }" />
            </span>
          </div>
        </div>
        <p class="hint">新闻与公告将在联调阶段替换为真实内容，当前不展示示例数据。</p>
      </div>
    </section>

    <details class="card route-check">
      <summary class="route-check__summary">
        <span class="route-check__title">骨架阶段：全站路由自检</span>
        <span class="pill pill--info">14 项</span>
      </summary>
      <p class="route-check__desc">
        逐一打开确认页面、底部导航高亮与返回按钮；联调开始后移除本卡片。
      </p>
      <ul class="route-check__list">
        <li v-for="item in routeChecklist" :key="item.label">
          <RouterLink class="route-check__link" :to="item.to">{{ item.label }}</RouterLink>
        </li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 22px 18px 20px;
  color: #fff;
  background: linear-gradient(135deg, #16224a 0%, #2b5cff 62%, #4d8bff 100%);
  border-radius: var(--radius-lg);
  box-shadow: 0 18px 38px -26px rgba(27, 42, 94, 0.9);
}

.hero::after {
  position: absolute;
  top: -46px;
  right: -36px;
  width: 150px;
  height: 150px;
  content: "";
  background: rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  pointer-events: none;
}

.hero__tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  margin-bottom: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
}

.hero__title {
  position: relative;
  font-size: 23px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.01em;
  overflow-wrap: anywhere;
}

.hero__desc {
  position: relative;
  max-width: 30em;
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
}

.hero__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.hero__btn {
  flex: 1 1 auto;
  min-width: 112px;
}

.hero__btn--solid {
  color: var(--c-primary-strong);
  background: #fff;
}

.hero__btn--outline {
  color: #fff;
  background: transparent;
  border-color: rgba(255, 255, 255, 0.5);
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 84px;
  padding: 14px;
  background: var(--c-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s var(--ease);
}

.tile:active {
  transform: scale(0.98);
}

.tile__title {
  font-size: 15px;
  font-weight: 600;
}

.tile__desc {
  font-size: 12px;
  color: var(--c-text-3);
}

.tile__arrow {
  margin-top: auto;
  padding-top: 8px;
  font-size: 14px;
  color: var(--c-primary);
}

.hint {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}

.route-check {
  padding: 0;
}

.route-check__summary {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 8px 16px;
  cursor: pointer;
  list-style: none;
}

.route-check__summary::-webkit-details-marker {
  display: none;
}

.route-check__title {
  font-size: 14px;
  font-weight: 600;
}

.route-check__desc {
  padding: 0 16px 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}

.route-check__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 0 16px 16px;
}

.route-check__link {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 10px;
  overflow: hidden;
  font-size: 12px;
  color: var(--c-text-2);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--c-surface-soft);
  border-radius: 8px;
}

.route-check__link:active {
  background: var(--c-primary-soft);
}
</style>
