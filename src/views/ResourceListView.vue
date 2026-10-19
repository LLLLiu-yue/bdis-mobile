<script setup>
import { ref } from 'vue'

// 与后端现有分类约定保持一致；“全部”不发送 category 参数
const categories = [
  { key: '', label: '全部' },
  { key: 'frontend', label: '前端' },
  { key: 'backend', label: '后端' },
  { key: 'database', label: '数据库' },
  { key: 'ai', label: '人工智能' },
  { key: 'tools', label: '工具' },
  { key: 'course', label: '课程' },
]

const activeCategory = ref('')
</script>

<template>
  <div class="page">
    <p class="page-lead">按分类浏览学习资料，资料通过外链打开，站内不复制正文。</p>

    <div class="chips" role="group" aria-label="资料分类">
      <button
        v-for="item in categories"
        :key="item.key || 'all'"
        type="button"
        class="chip"
        :class="{ 'chip--active': activeCategory === item.key }"
        :aria-pressed="activeCategory === item.key"
        @click="activeCategory = item.key"
      >
        {{ item.label }}
      </button>
    </div>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">资料列表</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card">
        <div class="ghost-list" aria-hidden="true">
          <div v-for="n in 4" :key="n" class="ghost-row">
            <span class="ghost-body">
              <span class="skeleton-line" :style="{ width: n % 2 === 0 ? '68%' : '86%' }" />
              <span class="skeleton-line skeleton-line--soft" style="width: 52%" />
            </span>
            <span class="ghost-tag" />
          </div>
        </div>
        <p class="hint">分类切换与分页在联调阶段接入，当前不展示示例资料。</p>
      </div>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        资料页的交互规则
      </p>
      <ul class="note-list">
        <li>只有资料与公告、搜索使用 page / limit / total 分页。</li>
        <li>切换分类或关键词时需要把页码重置回第 1 页。</li>
        <li>外链只允许 http 与 https，其他协议不提供跳转。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.ghost-tag {
  flex: 0 0 46px;
  height: 22px;
  background: #eef1f7;
  border-radius: 999px;
}

.hint {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}
</style>
