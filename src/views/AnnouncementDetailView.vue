<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const announcementId = computed(() => String(route.params.id ?? ''))
</script>

<template>
  <div class="page">
    <article class="card article">
      <p class="meta">公告 · ID {{ announcementId }}</p>
      <h2 class="article__title">公告标题将在接口接入后展示</h2>
      <p class="meta">分类与发布日期待接入</p>

      <div class="body-lines" aria-hidden="true">
        <span class="skeleton-line" style="width: 98%" />
        <span class="skeleton-line" style="width: 92%" />
        <span class="skeleton-line" style="width: 75%" />
      </div>
      <p class="hint">公告正文区域预留，当前不展示任何示例公告。</p>
    </article>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        公告页的独立约定
      </p>
      <ul class="note-list">
        <li>公告详情走独立路由与独立接口，不复用新闻详情组件。</li>
        <li>分类是枚举值，展示文案需要和负责人确认后再映射。</li>
        <li>data 为 null 时显示空状态，不伪造公告内容。</li>
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
