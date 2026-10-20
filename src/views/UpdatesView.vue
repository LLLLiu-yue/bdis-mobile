<script setup>
import { ref } from 'vue'
import AnnouncementPanel from '@/components/AnnouncementPanel.vue'

const tabs = [
  { key: 'news', label: '新闻' },
  { key: 'announcements', label: '公告' },
]

// 默认停在“公告”，因为 B 同学已完成公告面板；A 同学接入 NewsPanel 后，
// 这里把占位替换为 <NewsPanel />，并把默认值改回 'news' 即可。
const activeTab = ref('announcements')
</script>

<template>
  <div class="page">
    <div class="tabs" role="tablist" aria-label="动态分类">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab--active': activeTab === tab.key }"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 新闻：由 A 同学接入 NewsPanel.vue，完成后替换为 <NewsPanel /> -->
    <section v-show="activeTab === 'news'" class="tabpane">
      <div class="pending">
        <p class="pending__title">新闻列表待接入</p>
        <p class="pending__text">
          由 A 同学完成 <code>NewsPanel.vue</code> 与 <code>news.js</code> 后在此挂载。
        </p>
      </div>
    </section>

    <!-- 公告：B 同学已完成 -->
    <section v-show="activeTab === 'announcements'" class="tabpane">
      <AnnouncementPanel />
    </section>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab {
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0 18px;
  color: var(--c-text-2);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.tab--active {
  color: #fff;
  background: var(--c-primary);
  border-color: var(--c-primary);
}

.tabpane {
  min-width: 0;
}

.pending {
  padding: 28px 18px;
  text-align: center;
  background: var(--c-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.pending__title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
}

.pending__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-3);
}

.pending__text code {
  padding: 1px 5px;
  background: var(--c-surface-soft);
  border-radius: 5px;
  font-size: 12px;
}
</style>
