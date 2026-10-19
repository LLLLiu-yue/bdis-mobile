<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

// 五个主导航入口。“更多”不是独立路由，点击后展开二级入口面板。
const navItems = [
  { key: 'home', label: '首页', to: '/', icon: 'home' },
  { key: 'updates', label: '动态', to: '/updates', icon: 'updates' },
  { key: 'projects', label: '项目', to: '/projects', icon: 'projects' },
  { key: 'resources', label: '资料', to: '/resources', icon: 'resources' },
  { key: 'more', label: '更多', icon: 'more' },
]

const moreItems = [
  { badge: '关', label: '关于我们', desc: '实验室介绍与团队成员', to: '/about' },
  { badge: '加', label: '加入我们', desc: '招新流程与联系方式', to: '/join' },
  { badge: '搜', label: '全局搜索', desc: '新闻、公告与资料统一检索', to: '/search' },
  { badge: '成', label: '成长路线', desc: '技术成长路径（筹备中）', to: '/growth' },
]

const moreOpen = ref(false)
const panelEl = ref(null)

// 优先读路由 meta.navKey；缺失时按路径前缀兜底，保证高亮永远跟着地址走
const activeKey = computed(() => {
  const fromMeta = route.meta.navKey
  if (fromMeta) return fromMeta

  const path = route.path
  if (path === '/') return 'home'
  if (path.startsWith('/updates') || path.startsWith('/news') || path.startsWith('/announcements')) {
    return 'updates'
  }
  if (path.startsWith('/projects') || path.startsWith('/competitions')) return 'projects'
  if (path.startsWith('/resources')) return 'resources'
  if (['/about', '/join', '/search', '/growth'].some((p) => path.startsWith(p))) return 'more'
  return ''
})

function isActive(key) {
  return activeKey.value === key
}

async function toggleMore() {
  moreOpen.value = !moreOpen.value
  if (moreOpen.value) {
    await nextTick()
    panelEl.value?.focus()
  }
}

function closeMore() {
  moreOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') closeMore()
}

// 点击二级入口后立刻收起面板，避免返回时面板还盖在页面上
watch(
  () => route.fullPath,
  () => {
    moreOpen.value = false
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <nav class="bottom-nav" aria-label="主导航">
    <template v-for="item in navItems" :key="item.key">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        class="bottom-nav__item"
        :class="{ 'bottom-nav__item--active': isActive(item.key) }"
        :aria-current="isActive(item.key) ? 'page' : undefined"
        @click="closeMore"
      >
        <span class="bottom-nav__icon">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <template v-if="item.icon === 'home'">
              <path d="M3.8 10.4 12 3.8l8.2 6.6" />
              <path d="M5.8 9.4V20h5v-5.2h2.4V20h5V9.4" />
            </template>
            <template v-else-if="item.icon === 'updates'">
              <path d="M3 12h4.2l2.2-5.6 3.4 11.2 2.3-5.6H21" />
            </template>
            <template v-else-if="item.icon === 'projects'">
              <path d="M12 3.4 3.6 7.7 12 12l8.4-4.3z" />
              <path d="M3.6 12 12 16.3 20.4 12" />
              <path d="M3.6 16.3 12 20.6l8.4-4.3" />
            </template>
            <template v-else-if="item.icon === 'resources'">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </template>
          </svg>
        </span>
        <span class="bottom-nav__label">{{ item.label }}</span>
      </RouterLink>

      <button
        v-else
        type="button"
        class="bottom-nav__item"
        :class="{ 'bottom-nav__item--active': isActive(item.key) }"
        :aria-expanded="moreOpen"
        aria-haspopup="dialog"
        aria-controls="more-sheet"
        @click="toggleMore"
      >
        <span class="bottom-nav__icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.7" />
            <circle cx="12" cy="12" r="1.7" />
            <circle cx="19" cy="12" r="1.7" />
          </svg>
        </span>
        <span class="bottom-nav__label">{{ item.label }}</span>
      </button>
    </template>
  </nav>

  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="moreOpen" class="more-sheet" @click.self="closeMore">
        <div
          id="more-sheet"
          ref="panelEl"
          class="more-sheet__panel"
          role="dialog"
          aria-modal="true"
          aria-label="更多入口"
          tabindex="-1"
        >
          <span class="more-sheet__handle" aria-hidden="true" />
          <p class="more-sheet__title">更多</p>

          <RouterLink
            v-for="entry in moreItems"
            :key="entry.to"
            :to="entry.to"
            class="more-sheet__row"
            @click="closeMore"
          >
            <span class="more-sheet__badge" aria-hidden="true">{{ entry.badge }}</span>
            <span class="more-sheet__text">
              <span class="more-sheet__label">{{ entry.label }}</span>
              <span class="more-sheet__desc">{{ entry.desc }}</span>
            </span>
            <svg
              class="more-sheet__chevron"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9.5 5.5 16 12l-6.5 6.5" />
            </svg>
          </RouterLink>

          <button type="button" class="more-sheet__cancel" @click="closeMore">取消</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bottom-nav {
  position: relative;
  z-index: 20;
  display: grid;
  flex: 0 0 auto;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 4px calc(4px + env(safe-area-inset-right, 0px))
    calc(4px + env(safe-area-inset-bottom, 0px))
    calc(4px + env(safe-area-inset-left, 0px));
  background: #fff;
  border-top: 1px solid var(--c-border);
}

@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .bottom-nav {
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 52px;
  padding: 4px 2px;
  color: var(--c-text-3);
  background: transparent;
  border: 0;
  border-radius: 12px;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.18s var(--ease);
}

.bottom-nav__item--active {
  color: var(--c-primary);
}

.bottom-nav__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 26px;
  border-radius: 999px;
  transition: background-color 0.18s var(--ease);
}

.bottom-nav__item--active .bottom-nav__icon {
  background: var(--c-primary-soft);
}

.bottom-nav__label {
  max-width: 100%;
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
}

.bottom-nav__item--active .bottom-nav__label {
  font-weight: 600;
}

.more-sheet {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(14, 20, 32, 0.42);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.more-sheet__panel {
  width: 100%;
  max-width: 640px;
  max-height: calc(100dvh - 48px);
  padding: 8px clamp(14px, 4vw, 20px) calc(12px + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--c-surface);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -18px 40px -24px rgba(14, 20, 32, 0.55);
}

.more-sheet__panel:focus {
  outline: none;
}

.more-sheet__handle {
  display: block;
  width: 36px;
  height: 4px;
  margin: 2px auto 10px;
  background: var(--c-border);
  border-radius: 999px;
}

.more-sheet__title {
  padding: 0 2px 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-3);
  letter-spacing: 0.06em;
}

.more-sheet__row {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
  min-height: 60px;
  padding: 8px 2px;
  border-bottom: 1px solid var(--c-border);
  -webkit-tap-highlight-color: transparent;
}

.more-sheet__row:active {
  background: var(--c-surface-soft);
}

.more-sheet__badge {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--c-primary-soft);
  color: var(--c-primary-strong);
  font-size: 14px;
  font-weight: 600;
}

.more-sheet__text {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.more-sheet__label {
  font-size: 15px;
  font-weight: 600;
}

.more-sheet__desc {
  overflow: hidden;
  font-size: 12px;
  color: var(--c-text-3);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-sheet__chevron {
  flex: none;
  color: var(--c-text-3);
}

.more-sheet__cancel {
  width: 100%;
  min-height: 46px;
  margin-top: 10px;
  color: var(--c-text-2);
  background: var(--c-surface-soft);
  border: 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s var(--ease);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-active .more-sheet__panel,
.sheet-leave-active .more-sheet__panel {
  transition: transform 0.24s var(--ease);
}

.sheet-enter-from .more-sheet__panel,
.sheet-leave-to .more-sheet__panel {
  transform: translateY(14%);
}
</style>
