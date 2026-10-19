<script setup>
import { computed, ref } from 'vue'

const tabs = [
  { key: 'news', label: '新闻' },
  { key: 'announcements', label: '公告' },
]

const activeTab = ref('news')

const activeLabel = computed(() => (activeTab.value === 'news' ? '新闻' : '公告'))
</script>

<template>
  <div class="page">
    <p class="page-lead">新闻与公告聚合成一个动态入口，后续在这里完成切换、分类与分页。</p>

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

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">最新{{ activeLabel }}</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card">
        <div class="ghost-list" aria-hidden="true">
          <div v-for="n in 3" :key="n" class="ghost-row">
            <span class="ghost-thumb" />
            <span class="ghost-body">
              <span class="skeleton-line" :style="{ width: n === 3 ? '68%' : '90%' }" />
              <span class="skeleton-line skeleton-line--soft" :style="{ width: '40%' }" />
            </span>
          </div>
        </div>
        <p class="hint">当前为单列骨架，联调后接入真实列表与四种数据状态。</p>
      </div>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        两类内容的接口规则不一样
      </p>
      <ul class="note-list">
        <li>新闻列表直接返回数组，只支持 limit 与 category，没有服务端分页。</li>
        <li>公告列表返回 list 与 total，可以按 page、limit 翻页。</li>
        <li>公告与新闻使用各自独立的详情路由，相同数字 ID 也不会串内容。</li>
        <li>分类为“全部”时省略 category 参数，不发送单词 all。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.hint {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}
</style>
