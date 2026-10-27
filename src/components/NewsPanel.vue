<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import { getNewsList, categoryText } from '@/api/news.js'

// 与公告保持一致：每页条数常量化，避免魔法数字散落
const PAGE_SIZE = 10

const items = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getNewsList(PAGE_SIZE)
    // 防御性取值：约定列表接口返回数组；若后端改成 { list } 也能兼容，不会白屏
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.list)
        ? data.list
        : []
    items.value = list
  } catch (e) {
    error.value = e.message || '新闻加载失败，请重试'
    items.value = []
  } finally {
    loading.value = false
  }
}

// 封面加载失败（比如后端没同步图片）时把自己藏起来，不留裂图占位
function hideImage(e) {
  e.target.style.display = 'none'
}

// 首次加载
load()
</script>

<template>
  <div class="panel">
    <RequestState
      :loading="loading"
      :error="error"
      :empty="items.length === 0"
      empty-title="暂无新闻"
      empty-text="工作室还没有发布新闻，过段时间再来看看吧"
      :skeleton-rows="4"
      @retry="load"
    >
      <ul class="list">
        <li v-for="item in items" :key="item.id" class="row">
          <RouterLink :to="`/news/${item.id}`" class="row__link">
            <div class="row__main">
              <div class="row__top">
                <span class="tag">{{ categoryText(item.category) }}</span>
                <span class="date">{{ item.publishDate || item.publish_date || '' }}</span>
              </div>
              <h3 class="row__title">{{ item.title }}</h3>
              <p v-if="item.summary" class="row__summary">{{ item.summary }}</p>
            </div>

            <!-- 列表缩略图：后端字段 coverThumbUrl，路径形如 /api/uploads/xxx.jpg
                 或 /static/news/news1.jpg，两种前缀都已在 vite 代理里配好 -->
            <img
              v-if="item.coverThumbUrl"
              :src="item.coverThumbUrl"
              class="row__cover"
              alt=""
              referrerpolicy="no-referrer"
              @error="hideImage"
            />
          </RouterLink>
        </li>
      </ul>
    </RequestState>
  </div>
</template>

<style scoped>
.panel {
  min-width: 0;
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
  display: flex;
  gap: 12px;
  min-width: 0;
  padding: 14px;
  color: inherit;
  text-decoration: none;
}

.row__main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.row__top {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.tag {
  flex: 0 0 auto;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-primary-soft);
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
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row__cover {
  flex: 0 0 68px;
  width: 68px;
  height: 68px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--c-surface-soft);
}
</style>
