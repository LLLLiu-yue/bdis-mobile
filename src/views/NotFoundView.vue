<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RequestState from '@/components/RequestState.vue'

const route = useRoute()
const router = useRouter()

const attemptedPath = computed(() => {
  const matched = route.params.pathMatch
  if (Array.isArray(matched) && matched.length) return `/${matched.join('/')}`
  if (typeof matched === 'string' && matched) return `/${matched}`
  return route.path
})

function goBack() {
  if (router.options.history.state.back !== null) {
    router.back()
    return
  }
  router.replace('/')
}
</script>

<template>
  <div class="page not-found">
    <p class="not-found__code" aria-hidden="true">404</p>

    <RequestState
      :empty="true"
      empty-title="页面不存在"
      :empty-text="`没有找到 ${attemptedPath} 对应的页面，可能已经移动或被删除。`"
    >
      <template #action>
        <div class="not-found__actions">
          <RouterLink class="btn btn--primary" to="/">返回首页</RouterLink>
          <button type="button" class="btn btn--ghost" @click="goBack">返回上一页</button>
        </div>
      </template>
    </RequestState>

    <p class="not-found__hint">
      检查地址是否输入正确，或从底部导航重新进入需要的栏目。
    </p>
  </div>
</template>

<style scoped>
.not-found {
  padding-top: 8px;
}

.not-found__code {
  font-size: 54px;
  font-weight: 800;
  line-height: 1;
  text-align: center;
  color: var(--c-primary);
  letter-spacing: 0.04em;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.not-found__hint {
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
  color: var(--c-text-3);
}
</style>
