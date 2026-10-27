<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import { getProjectDetail, statusText, normalizeProgress, pickTags } from '@/api/projects.js'

const route = useRoute()
// ID 全程保持字符串：项目主键是 p-001 这种，绝不能 Number(id)
const id = computed(() => String(route.params.id ?? ''))

const detail = ref(null)
const loading = ref(false)
const error = ref('')
const notFound = ref(false)

// 后端同时给了字符串和数组两种形式，pickTags 会优先用数组
const roles = computed(() => pickTags(detail.value, 'recruitRoles'))
const members = computed(() => pickTags(detail.value, 'members'))
const progress = computed(() => normalizeProgress(detail.value?.progress))
const cover = computed(() => detail.value?.coverUrl || '')
const updatedAt = computed(() => detail.value?.updatedAt || detail.value?.updated_at || '')
// 项目名称里“系统开发：BDIS 官网.V1”这种带前缀，副标题用 tagline 兜底即可
const tagline = computed(() => detail.value?.tagline || '')

async function load() {
  // 离开详情页时路由参数会变空，避免发一次无意义的请求
  if (!id.value) return

  loading.value = true
  error.value = ''
  notFound.value = false
  detail.value = null
  try {
    const data = await getProjectDetail(id.value)
    // data 为 null：项目不存在或已下线，是正常业务态，不是报错
    if (data == null) {
      notFound.value = true
    } else {
      detail.value = data
    }
  } catch (e) {
    error.value = e.message || '项目加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 同一个详情组件从 /projects/p-001 切到 /projects/p-002 不会重新挂载，
// 必须监听路由参数重新请求，否则内容会一直停在第一个项目
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
      empty-title="项目不存在或已下线"
      empty-text="这个项目可能已经结束或暂未公开，去项目列表看看其他内容吧"
      @retry="load"
    >
      <div v-if="detail" class="card project">
        <img
          v-if="cover"
          :src="cover"
          class="project__cover"
          alt=""
          referrerpolicy="no-referrer"
          @error="hideImage"
        />

        <div class="project__head">
          <span class="status-pill" :class="`status-pill--${detail.status || 'ongoing'}`">
            {{ statusText(detail.status) }}
          </span>
          <span v-if="updatedAt" class="project__time">{{ updatedAt }}</span>
        </div>

        <h2 class="project__title">{{ detail.name }}</h2>
        <p v-if="tagline" class="project__tagline">{{ tagline }}</p>

        <div class="progress-block">
          <div class="progress-block__row">
            <span class="progress-block__label">研发进度</span>
            <span class="progress-block__num">{{ progress }}%</span>
          </div>
          <div class="bar__track" aria-hidden="true">
            <div class="bar__fill" :style="{ width: progress + '%' }" />
          </div>
        </div>

        <!-- 项目实体没有正文字段，这里只展示后端真实返回的字段，不虚构简介 -->
        <dl class="field-list">
          <div class="field">
            <dt class="field__label">招募角色</dt>
            <dd class="field__value">
              <template v-if="roles.length">
                <span v-for="role in roles" :key="role" class="tag">{{ role }}</span>
              </template>
              <span v-else>暂不招募</span>
            </dd>
          </div>
          <div class="field">
            <dt class="field__label">项目成员</dt>
            <dd class="field__value">
              <template v-if="members.length">
                <span v-for="m in members" :key="m" class="tag tag--soft">{{ m }}</span>
              </template>
              <span v-else>暂未公开</span>
            </dd>
          </div>
          <div class="field">
            <dt class="field__label">项目标识</dt>
            <dd class="field__value">
              <code class="project-id">{{ id }}</code>
            </dd>
          </div>
        </dl>
      </div>
    </RequestState>

    <div v-if="detail" class="note-card">
      <p class="note-card__title">
        <span class="pill pill--info">说明</span>
        关于字段的说明
      </p>
      <ul class="note-list">
        <li>详情返回的字段与列表完全一致，后端没有提供正文或长介绍，所以这里不展示额外内容。</li>
        <li>招募角色为空时显示“暂不招募”，成员为空时显示“暂未公开”，不造数据充数。</li>
      </ul>
    </div>

    <RouterLink class="btn btn--ghost" to="/projects">返回项目列表</RouterLink>
  </div>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.project__cover {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.project__head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.status-pill {
  flex: 0 0 auto;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-primary-soft);
}

.status-pill--recruiting {
  color: #a4520b;
  background: #fdf1e0;
}

.project__time {
  flex: 1 1 auto;
  min-width: 0;
  text-align: right;
  font-size: 12px;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.project__title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.project__tagline {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text-2);
  overflow-wrap: anywhere;
}

.progress-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.progress-block__row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.progress-block__label {
  font-size: 13px;
  color: var(--c-text-3);
}

.progress-block__num {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-primary);
}

.bar__track {
  min-width: 0;
  height: 6px;
  background: var(--c-surface-soft);
  border-radius: 999px;
  overflow: hidden;
}

.bar__fill {
  height: 100%;
  background: var(--c-primary);
  border-radius: 999px;
}

.tag {
  display: inline-block;
  margin: 0 6px 6px 0;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--c-primary);
  background: var(--c-primary-soft);
  overflow-wrap: anywhere;
}

.tag--soft {
  color: var(--c-text-2);
  background: var(--c-surface-soft);
}

.project-id {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
