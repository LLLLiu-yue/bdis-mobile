<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import { getNewsDetail, categoryText } from '@/api/news.js'

const route = useRoute()
// ID 全程保持字符串：雪花 ID 超过 2^53，转 Number 会丢精度导致查不到
const id = computed(() => String(route.params.id ?? ''))

const detail = ref(null)
const loading = ref(false)
const error = ref('')
const notFound = ref(false)

// 后端真实字段名是驼峰（publishDate / coverThumbUrl），蛇形写法只作兜底
const publishDate = computed(() => detail.value?.publishDate || detail.value?.publish_date || '')
const cover = computed(() => detail.value?.coverThumbUrl || detail.value?.cover_thumb_url || '')

async function load() {
  // 离开详情页时路由参数会变成空，避免发一次无意义的请求
  if (!id.value) return

  loading.value = true
  error.value = ''
  notFound.value = false
  detail.value = null
  try {
    const data = await getNewsDetail(id.value)
    // data 为 null/undefined：内容不存在或已下架，是正常业务态，不是报错
    if (data == null) {
      notFound.value = true
    } else {
      detail.value = data
    }
  } catch (e) {
    error.value = e.message || '新闻加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 同一个详情组件从 /news/1 切到 /news/2 不会重新挂载，
// 必须监听路由参数重新请求，否则会一直停在上一篇
watch(() => route.params.id, load, { immediate: true })
</script>

<template>
  <div class="page">
    <RequestState
      :loading="loading"
      :error="error"
      :empty="notFound"
      empty-title="新闻不存在或已下架"
      empty-text="这条新闻可能已被移除，去动态列表看看其他内容吧"
      @retry="load"
    >
      <article v-if="detail" class="card article">
        <div class="article__meta">
          <span class="tag">{{ categoryText(detail.category) }}</span>
          <span class="date">{{ publishDate }}</span>
        </div>
        <h2 class="article__title">{{ detail.title }}</h2>
        <p v-if="detail.summary" class="article__summary">{{ detail.summary }}</p>

        <img
          v-if="cover"
          :src="cover"
          class="cover"
          alt=""
          referrerpolicy="no-referrer"
          @error="(e) => (e.target.style.display = 'none')"
        />

        <!-- 正文：后端 content 字段存的是富文本 HTML，用 v-html 渲染。
             内容仅由管理后台录入，属于可信来源；若将来开放用户投稿，
             必须先做 HTML 清洗（如 DOMPurify）再渲染，防止 XSS。 -->
        <div class="article__body" v-html="detail.content || '（暂无正文）'"></div>
      </article>
    </RequestState>

    <RouterLink class="btn btn--ghost" to="/updates">返回动态列表</RouterLink>
  </div>
</template>

<style scoped>
.card {
  padding: 16px;
}

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
}
</style>
