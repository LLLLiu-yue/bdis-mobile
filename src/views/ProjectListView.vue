<script setup>
import { ref } from 'vue'

const filters = [
  { key: 'all', label: '全部' },
  { key: 'recruiting', label: '招募中' },
  { key: 'ongoing', label: '进行中' },
  { key: 'done', label: '已完成' },
]

const activeFilter = ref('all')
</script>

<template>
  <div class="page">
    <p class="page-lead">项目以单列卡片呈现名称、状态与进度，点开进入项目详情。</p>

    <div class="chips" role="group" aria-label="项目状态筛选">
      <button
        v-for="item in filters"
        :key="item.key"
        type="button"
        class="chip"
        :class="{ 'chip--active': activeFilter === item.key }"
        :aria-pressed="activeFilter === item.key"
        @click="activeFilter = item.key"
      >
        {{ item.label }}
      </button>
    </div>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">项目列表</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>

      <article v-for="n in 2" :key="n" class="card project-card" aria-label="项目卡片骨架">
        <div class="project-card__head">
          <span class="skeleton-line" style="width: 64px; height: 20px" />
          <span class="skeleton-line skeleton-line--soft" style="width: 52px" />
        </div>
        <span class="skeleton-line" :style="{ width: n === 1 ? '76%' : '58%', height: '16px' }" />
        <span class="skeleton-line skeleton-line--soft" style="width: 90%" />
        <div class="progress" aria-hidden="true" />
        <span class="project-card__note">进度与状态待接入</span>
      </article>

      <p class="hint">筛选按钮已就位，真实列表与空数据提示在联调阶段接入。</p>
    </section>

    <RouterLink class="card entry" to="/competitions">
      <span class="entry__text">
        <span class="entry__title">竞赛招募</span>
        <span class="entry__desc">查看创新竞赛与队伍招募信息</span>
      </span>
      <span class="entry__arrow" aria-hidden="true">→</span>
    </RouterLink>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        项目数据的两个硬要求
      </p>
      <ul class="note-list">
        <li>项目 ID 是长字符串主键，全程按字符串处理，不做 Number 或 parseInt。</li>
        <li>招募角色与成员是逗号分隔字符串，展示前先过滤空白项。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-card__head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.project-card__note {
  font-size: 11px;
  color: var(--c-text-3);
}

.hint {
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}

.entry {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  transition: transform 0.15s var(--ease);
}

.entry:active {
  transform: scale(0.99);
}

.entry__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.entry__title {
  font-size: 15px;
  font-weight: 600;
}

.entry__desc {
  font-size: 12px;
  color: var(--c-text-3);
}

.entry__arrow {
  flex: none;
  font-size: 16px;
  color: var(--c-primary);
}
</style>
