<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import {
  getAnnouncementDetail,
  announcementCategoryLabel,
} from '@/api/announcements.js'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))

const detail = ref(null)
const loading = ref(false)
const error = ref('')
const notFound = ref(false)

async function load() {
  loading.value = true
  error.value = ''
  notFound.value = false
  detail.value = null
  try {
    const data = await getAnnouncementDetail(id.value)
    // data 为 null/undefined：内容已下架或不存在，是正常业务态，不是报错
    if (data == null) {
      notFound.value = true
    } else {
      detail.value = data
    }
  } catch (e) {
    error.value = e.message || '公告加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 同一个详情组件从 /announcements/1 切到 /announcements/2 不会重新挂载，
// 必须监听路由参数重新请求，否则会一直停在上一篇。
watch(() => route.params.id, load, { immediate: true })
</script>

<template>
  <div class="page">
    <RequestState
      :loading="loading"
      :error="error"
      :empty="notFound"
      empty-title="公告不存在或已下架"
      empty-text="该公告可能已被移除，去动态列表看看其他内容吧"
      @retry="load"
    >
      <article v-if="detail" class="card article">
        <div class="article__meta">
          <span class="tag">{{ announcementCategoryLabel(detail.category) }}</span>
          <span class="date">{{ detail.publish_date || detail.publishDate || '' }}</span>
        </div>
        <h2 class="article__title">{{ detail.title }}</h2>
        <p v-if="detail.summary" class="article__summary">{{ detail.summary }}</p>

        <img
          v-if="detail.cover_thumb_url"
          :src="detail.cover_thumb_url"
          class="cover"
          alt=""
          referrerpolicy="no-referrer"
          @error="(e) => (e.target.style.display = 'none')"
        />

        <!-- 正文暂按纯文本展示，HTML 清洗方案确认后再处理 -->
        <div class="article__body">{{ detail.content || '（暂无正文）' }}</div>
      </article>
    </RequestState>

    <RouterLink class="btn btn--ghost" to="/updates">返回动态列表</RouterLink>
  </div>
</template>

<style scoped>
.article {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

.article__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.article__summary {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text-2);
  overflow-wrap: anywhere;
}

.cover {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.article__body {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--c-text-1);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
