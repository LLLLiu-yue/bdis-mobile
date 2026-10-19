<script setup>
// 第一版展示上限，接口本身没有分页与 total
const MAX_ITEMS = 20
</script>

<template>
  <div class="page">
    <p class="page-lead">
      创新竞赛与队伍招募信息，第一版最多展示 {{ MAX_ITEMS }} 条。
    </p>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">招募列表</h2>
        <span class="section__aside">最多 {{ MAX_ITEMS }} 条</span>
      </div>

      <article v-for="n in 2" :key="n" class="card recruit-card" aria-label="竞赛招募卡片骨架">
        <span class="skeleton-line" :style="{ width: n === 1 ? '82%' : '64%', height: '16px' }" />
        <span class="skeleton-line skeleton-line--soft" style="width: 92%" />
        <div class="recruit-card__meta">
          <span class="skeleton-line skeleton-line--soft" style="width: 72px" />
          <span class="skeleton-line skeleton-line--soft" style="width: 88px" />
        </div>
      </article>

      <p class="hint">招募人数、截止时间与角色标签在接口接入后展示。</p>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        列表页的边界
      </p>
      <ul class="note-list">
        <li>接口只有 limit，没有页码和 total，不添加点了没反应的分页器。</li>
        <li>limit 必须是正整数，0 会得到空列表。</li>
        <li>后端没有报名或入队接口，不设计“点击即报名”的按钮。</li>
      </ul>
    </div>

    <RouterLink class="btn btn--ghost" to="/projects">返回项目区</RouterLink>
  </div>
</template>

<style scoped>
.recruit-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recruit-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hint {
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}
</style>
