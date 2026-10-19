<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const newsId = computed(() => String(route.params.id ?? ''))
</script>

<template>
  <div class="page">
    <article class="card article">
      <p class="meta">新闻 · ID {{ newsId }}</p>
      <h2 class="article__title">新闻标题将在接口接入后展示</h2>
      <p class="meta">发布日期待接入</p>

      <div class="body-lines" aria-hidden="true">
        <span class="skeleton-line" style="width: 100%" />
        <span class="skeleton-line" style="width: 94%" />
        <span class="skeleton-line" style="width: 97%" />
        <span class="skeleton-line" style="width: 62%" />
      </div>
      <p class="hint">正文区域预留，当前不展示任何示例文章。</p>
    </article>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        详情页需要处理的情况
      </p>
      <ul class="note-list">
        <li>接口返回 data 为 null 时，展示“内容不存在或已下架”，而不是继续读标题。</li>
        <li>同一组件连续切换不同 ID 时不会重新挂载，需要监听路由参数重新请求。</li>
        <li>正文可能是 HTML，清洗方案确认前先按纯文本展示。</li>
      </ul>
    </div>

    <RouterLink class="btn btn--ghost" to="/updates">返回动态列表</RouterLink>
  </div>
</template>

<style scoped>
.article {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta {
  font-size: 12px;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.article__title {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.body-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.hint {
  margin-top: 2px;
  font-size: 12px;
  color: var(--c-text-3);
}
</style>
