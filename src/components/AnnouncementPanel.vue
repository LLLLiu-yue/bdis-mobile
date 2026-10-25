<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import {
  getAnnouncementList,
  ANNOUNCEMENT_CATEGORIES,
  announcementCategoryLabel,
} from '@/api/announcements.js'

const PAGE_SIZE = 10

const category = ref('') // '' 表示全部
const page = ref(1)

const items = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref('')

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / PAGE_SIZE)),
)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getAnnouncementList({
      page: page.value,
      limit: PAGE_SIZE,
      category: category.value || undefined,
    })
    items.value = Array.isArray(data?.list) ? data.list : []
    total.value =
      typeof data?.total === 'number' ? data.total : items.value.length

    // 防御：后端返回空列表但 total>0，说明翻到了不存在的页，回退第 1 页
    if (items.value.length === 0 && total.value > 0 && page.value !== 1) {
      page.value = 1
      return load()
    }
  } catch (e) {
    error.value = e.message || '公告加载失败，请重试'
    items.value = []
  } finally {
    loading.value = false
  }
}

function selectCategory(value) {
  if (value === category.value) return
  category.value = value
  page.value = 1 // 切分类必须回到第 1 页
  load()
}

function goPage(next) {
  const target = Math.min(Math.max(next, 1), totalPages.value)
  if (target === page.value) return
  page.value = target
  load()
}

// 首次加载
load()
</script>

<template>
  <div class="panel">
    <div class="chips" role="tablist" aria-label="公告分类">
      <button
        v-for="c in ANNOUNCEMENT_CATEGORIES"
        :key="c.value"
        type="button"
        class="chip"
        :class="{ 'chip--active': category === c.value }"
        :aria-pressed="category === c.value"
        @click="selectCategory(c.value)"
      >
        {{ c.label }}
      </button>
    </div>

    <RequestState
      :loading="loading"
      :error="error"
      :empty="items.length === 0"
      empty-title="暂无公告"
      empty-text="该分类下还没有发布内容"
      @retry="load"
    >
      <ul class="list">
        <li v-for="item in items" :key="item.id" class="row">
          <RouterLink :to="`/announcements/${item.id}`" class="row__link">
            <div class="row__top">
              <span class="tag">{{ announcementCategoryLabel(item.category) }}</span>
              <span class="date">{{ item.publish_date || item.publishDate || '' }}</span>
            </div>
            <h3 class="row__title">{{ item.title }}</h3>
            <p v-if="item.summary" class="row__summary">{{ item.summary }}</p>
          </RouterLink>
        </li>
      </ul>

      <nav v-if="totalPages > 1" class="pager" aria-label="分页">
        <button
          type="button"
          class="pager__btn"
          :disabled="page <= 1"
          @click="goPage(page - 1)"
        >
          上一页
        </button>
        <span class="pager__info">{{ page }} / {{ totalPages }}</span>
        <button
          type="button"
          class="pager__btn"
          :disabled="page >= totalPages"
          @click="goPage(page + 1)"
        >
          下一页
        </button>
      </nav>
    </RequestState>
  </div>
</template>

<style scoped>
.panel {
  min-width: 0;
}

/* 分类条：局部横向滚动，不会撑出整页横向滚动条 */
.chips {
  display: flex;
  gap: 8px;
  min-width: 0;
  margin-bottom: 14px;
  padding-bottom: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.chips::-webkit-scrollbar {
  display: none;
}

.chip {
  flex: 0 0 auto;
  min-height: 34px;
  padding: 0 14px;
  color: var(--c-text-2);
  background: var(--c-surface-soft);
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 13px;
  white-space: nowrap;
}

.chip--active {
  color: #fff;
  background: var(--c-primary);
  border-color: var(--c-primary);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  min-width: 0;
  background: var(--c-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.row__link {
  display: block;
  min-width: 0;
  padding: 14px;
  color: inherit;
  text-decoration: none;
}

.row__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.tag {
  flex: 0 0 auto;
  padding: 2px 9px;
  color: var(--c-primary);
  background: var(--c-primary-soft);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.date {
  flex: 1 1 auto;
  min-width: 0;
  text-align: right;
  font-size: 12px;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.row__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.row__summary {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
}

.pager__btn {
  flex: 0 0 auto;
  min-height: 40px;
  padding: 0 18px;
  color: var(--c-text-1);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.pager__btn:disabled {
  color: var(--c-text-3);
  background: var(--c-surface-soft);
  border-color: transparent;
  opacity: 0.7;
}

.pager__info {
  flex: 1 1 auto;
  text-align: center;
  font-size: 13px;
  color: var(--c-text-2);
}
</style>
