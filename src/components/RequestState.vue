<script setup>
import { computed, getCurrentInstance } from 'vue'

/**
 * 统一请求状态容器
 *
 * 用法（后续新闻 / 公告 / 项目等页面共用）：
 *   <RequestState :loading="loading" :error="error" :empty="!items.length" @retry="load">
 *     <ul>...</ul>
 *   </RequestState>
 *
 * 四种状态按优先级切换：加载中 → 失败 → 空数据 → 正常（默认插槽）。
 */
const props = defineProps({
  loading: { type: Boolean, default: false },
  // 可以是字符串，也可以是 Error / 接口返回对象
  error: { type: [String, Object], default: '' },
  empty: { type: Boolean, default: false },
  loadingText: { type: String, default: '正在加载…' },
  errorTitle: { type: String, default: '加载失败' },
  errorText: { type: String, default: '请检查网络连接后重试' },
  emptyTitle: { type: String, default: '这里还空着' },
  emptyText: { type: String, default: '暂无数据' },
  retryText: { type: String, default: '重新加载' },
  skeletonRows: { type: Number, default: 3 },
})

const emit = defineEmits(['retry'])

const instance = getCurrentInstance()
// 父组件没有监听 retry 时不渲染按钮，避免出现点了没反应的假按钮
const canRetry = computed(() => typeof instance?.vnode.props?.onRetry === 'function')

const mode = computed(() => {
  if (props.loading) return 'loading'
  if (props.error) return 'error'
  if (props.empty) return 'empty'
  return 'ready'
})

const errorMessage = computed(() => {
  if (!props.error) return ''
  if (typeof props.error === 'string') return props.error
  return props.error.message || props.errorText
})

const skeletonWidths = computed(() =>
  Array.from({ length: Math.min(Math.max(props.skeletonRows, 1), 6) }, (_, index) => {
    return `${100 - index * 11}%`
  }),
)
</script>

<template>
  <div class="request-state">
    <div v-if="mode === 'loading'" class="rs-panel" role="status" aria-live="polite">
      <div class="rs-skeleton" aria-hidden="true">
        <span
          v-for="(width, index) in skeletonWidths"
          :key="index"
          class="rs-skeleton__line"
          :style="{ width }"
        />
      </div>
      <p class="rs-text">{{ loadingText }}</p>
    </div>

    <div v-else-if="mode === 'error'" class="rs-panel rs-panel--error" role="alert">
      <span class="rs-icon rs-icon--error" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 8v5" />
          <path d="M12 16.5h.01" />
          <path d="M12 3.5 21 20H3z" />
        </svg>
      </span>
      <p class="rs-title">{{ errorTitle }}</p>
      <p class="rs-text">{{ errorMessage }}</p>
      <button v-if="canRetry" type="button" class="rs-action" @click="emit('retry')">
        {{ retryText }}
      </button>
    </div>

    <div v-else-if="mode === 'empty'" class="rs-panel rs-panel--empty" role="status">
      <span class="rs-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3.5 13.5 6.2 5h11.6l2.7 8.5V19H3.5z" />
          <path d="M3.5 13.5h4l1.2 2.2h6.6l1.2-2.2h4" />
        </svg>
      </span>
      <p class="rs-title">{{ emptyTitle }}</p>
      <p class="rs-text">
        <slot name="empty">{{ emptyText }}</slot>
      </p>
      <slot name="action" />
    </div>

    <slot v-else />
  </div>
</template>

<style scoped>
.request-state {
  min-width: 0;
}

.rs-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  min-width: 0;
  padding: 28px 18px;
  text-align: center;
  background: var(--c-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.rs-title {
  font-size: 15px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.rs-text {
  max-width: 34em;
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.rs-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 2px;
  border-radius: 14px;
  background: var(--c-surface-soft);
  color: var(--c-text-3);
}

.rs-icon--error {
  background: var(--c-danger-soft);
  color: var(--c-danger);
}

.rs-action {
  min-height: 44px;
  margin-top: 6px;
  padding: 0 22px;
  color: #fff;
  background: var(--c-primary);
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.rs-action:active {
  transform: scale(0.97);
}

.rs-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: stretch;
  min-width: 0;
  padding: 4px 2px 2px;
}

.rs-skeleton__line {
  max-width: 100%;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #eef1f7 25%, #f7f9fd 37%, #eef1f7 63%);
  background-size: 400% 100%;
  animation: rs-shimmer 1.4s ease infinite;
}

@keyframes rs-shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: 0 0;
  }
}
</style>
