<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import { getCompetitionDetail, categoryText } from '@/api/competitions.js'
import { safeHttpUrl } from '@/api/resources.js'

const route = useRoute()
// ID 全程保持字符串（线上主键是 demo-forum-001 这种），绝不能 Number(id)
const id = computed(() => String(route.params.id ?? ''))

const detail = ref(null)
const loading = ref(false)
const error = ref('')
const notFound = ref(false)

const cover = computed(() => detail.value?.coverThumbUrl || detail.value?.cover_thumb_url || '')
// link 只有 http/https 才渲染成外链，其余（含 null）一律不显示按钮
const outerLink = computed(() => safeHttpUrl(detail.value?.link))
const publishDate = computed(
  () => detail.value?.publishDate || detail.value?.publish_date || '',
)
const publisher = computed(() => detail.value?.publisher || '')

async function load() {
  // 离开详情页时路由参数会变成空，避免发一次无意义的请求
  if (!id.value) return

  loading.value = true
  error.value = ''
  notFound.value = false
  detail.value = null
  try {
    const data = await getCompetitionDetail(id.value)
    // data 为 null：内容不存在或已下架，是正常业务态，不是报错
    if (data == null) {
      notFound.value = true
    } else {
      detail.value = data
    }
  } catch (e) {
    error.value = e.message || '招募信息加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 同一个详情组件从 /competitions/a 切到 /competitions/b 不会重新挂载，
// 必须监听路由参数重新请求，否则内容会一直停在上一条
watch(() => route.params.id, load, { immediate: true })

function hideImage(e) {
  e.target.style.display = 'none'
}
</script>

<template>
  <div class="page">
    <RequestState
      :loading="loading"
      :error="error"
      :empty="notFound"
      empty-title="该组队信息不存在"
      empty-text="这条招募可能已结束或被移除，去列表看看其他内容吧"
      @retry="load"
    >
      <article v-if="detail" class="card recruit">
        <img
          v-if="cover"
          :src="cover"
          class="recruit__cover"
          alt=""
          referrerpolicy="no-referrer"
          @error="hideImage"
        />

        <div class="recruit__meta">
          <span class="recruit__tag">{{ categoryText(detail.category) }}</span>
          <span v-if="publishDate" class="recruit__time">{{ publishDate }}</span>
        </div>

        <h2 class="recruit__title">{{ detail.title }}</h2>
        <p v-if="detail.summary" class="recruit__summary">{{ detail.summary }}</p>

        <!-- 正文：后端 content 字段存的是富文本 HTML，用 v-html 渲染。
             内容仅由管理后台录入，属于可信来源；若将来开放用户投稿，
             必须先做 HTML 清洗（如 DOMPurify）再渲染，防止 XSS。 -->
        <div class="recruit__body" v-html="detail.content || '（暂无正文）'"></div>

        <dl class="field-list">
          <div v-if="publisher" class="field">
            <dt class="field__label">发布者</dt>
            <dd class="field__value">{{ publisher }}</dd>
          </div>
          <div v-if="outerLink" class="field">
            <dt class="field__label">相关链接</dt>
            <dd class="field__value">
              <a class="recruit__link" :href="outerLink" target="_blank" rel="noopener">
                查看原文
              </a>
            </dd>
          </div>
        </dl>
      </article>
    </RequestState>

    <RouterLink class="btn btn--ghost" to="/competitions">返回招募列表</RouterLink>
  </div>
</template>

<style scoped>
.recruit {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recruit__cover {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.recruit__meta {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.recruit__tag {
  flex: 0 0 auto;
  padding: 2px 9px;
  color: var(--c-primary);
  background: var(--c-primary-soft);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.recruit__time {
  flex: 1 1 auto;
  min-width: 0;
  text-align: right;
  font-size: 12px;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.recruit__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.recruit__summary {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text-2);
  overflow-wrap: anywhere;
}

.recruit__body {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--c-text-1);
  overflow-wrap: anywhere;
}

.recruit__link {
  color: var(--c-primary);
  font-weight: 600;
  text-decoration: none;
}
</style>
