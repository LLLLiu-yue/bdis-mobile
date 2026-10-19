<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: '大数据智能工作室',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  // 直接打开深链接时站内没有上一条记录，需要退回到这个落点
  backTo: {
    type: String,
    default: '/',
  },
})

const router = useRouter()

function goBack() {
  const hasHistory = router.options.history.state.back !== null
  if (hasHistory) {
    router.back()
    return
  }
  router.replace(props.backTo)
}
</script>

<template>
  <header class="page-header">
    <button
      v-if="showBack"
      type="button"
      class="page-header__back"
      aria-label="返回上一页"
      @click="goBack"
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M14.5 5 8 12l6.5 7" />
      </svg>
    </button>

    <span class="page-header__mark" aria-hidden="true">B</span>

    <p class="page-header__title">{{ title }}</p>

    <div class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  position: relative;
  z-index: 20;
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: var(--header-height);
  /* 刘海屏 / 状态栏安全区，横屏时也避开左右圆角 */
  padding: calc(6px + env(safe-area-inset-top, 0px))
    calc(clamp(10px, 3.4vw, 18px) + env(safe-area-inset-right, 0px)) 6px
    calc(clamp(10px, 3.4vw, 18px) + env(safe-area-inset-left, 0px));
  background: #fff;
  border-bottom: 1px solid var(--c-border);
}

/* 支持毛玻璃时再用半透明，避免老旧 Android WebView 透出正文 */
@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .page-header {
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
}

.page-header__back {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-left: -10px;
  padding: 0;
  color: var(--c-text);
  background: transparent;
  border: 0;
  border-radius: 50%;
  -webkit-tap-highlight-color: transparent;
}

.page-header__back:active {
  background: var(--c-surface-soft);
}

.page-header__mark {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1b2a5e 0%, #2b5cff 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.page-header__title {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-header__actions {
  display: flex;
  flex: none;
  gap: 4px;
  align-items: center;
}

.page-header__actions:empty {
  display: none;
}
</style>
