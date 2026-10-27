<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import { getProjectList, statusText, normalizeProgress } from '@/api/projects.js'

const items = ref([])
const loading = ref(false)
const error = ref('')

// 线上真实数据只出现过 ongoing 与 recruiting 两种状态
const filters = [
  { key: 'all', label: '全部' },
  { key: 'recruiting', label: '招募中' },
  { key: 'ongoing', label: '进行中' },
]
const activeFilter = ref('all')

// 后端没有提供 ?status= 参数（未验证），所以筛选放在前端做：
// 宁可多取一次全量数据，也不去赌一个可能不存在的接口约定
const visibleItems = computed(() => {
  if (activeFilter.value === 'all') return items.value
  return items.value.filter((item) => item.status === activeFilter.value)
})

// 区分“一个都没有”和“当前筛选下没有”，避免给用户误导性的空状态文案
const emptyTitle = computed(() => (items.value.length === 0 ? '暂无项目' : '该状态下暂无项目'))
const emptyText = computed(() =>
  items.value.length === 0
    ? '工作室还没有发布在研项目，稍后再来看看吧'
    : '换个筛选条件看看其它状态的项目',
)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getProjectList()
    // 防御性取值：约定返回数组，若以后改成 { list } 也能兼容，不会白屏
    const list = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : []
    items.value = list
  } catch (e) {
    error.value = e.message || '项目加载失败，请重试'
    items.value = []
  } finally {
    loading.value = false
  }
}

// 图片加载失败时把自己藏起来，避免出现裂图占位
function hideImage(e) {
  e.target.style.display = 'none'
}

load()
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

    <RequestState
      :loading="loading"
      :error="error"
      :empty="visibleItems.length === 0"
      :empty-title="emptyTitle"
      :empty-text="emptyText"
      :skeleton-rows="4"
      @retry="load"
    >
      <ul class="project-list">
        <li v-for="item in visibleItems" :key="item.id">
          <RouterLink :to="`/projects/${item.id}`" class="card project-card">
            <!-- 封面：后端路径形如 /static/news/news1.jpg，已在 vite 代理里配了 /static -->
            <img
              v-if="item.coverUrl"
              :src="item.coverUrl"
              class="project-card__cover"
              alt=""
              referrerpolicy="no-referrer"
              @error="hideImage"
            />
            <div class="project-card__body">
              <div class="project-card__head">
                <span class="status-pill" :class="`status-pill--${item.status || 'ongoing'}`">
                  {{ statusText(item.status) }}
                </span>
                <span class="project-card__time">
                  {{ item.updatedAt || item.updated_at || '' }}
                </span>
              </div>

              <h3 class="project-card__title">{{ item.name }}</h3>
              <p v-if="item.tagline" class="project-card__tagline">{{ item.tagline }}</p>

              <div class="bar">
                <div class="bar__track" aria-hidden="true">
                  <div class="bar__fill" :style="{ width: normalizeProgress(item.progress) + '%' }" />
                </div>
                <span class="bar__num">{{ normalizeProgress(item.progress) }}%</span>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </RequestState>

    <RouterLink class="card entry" to="/competitions">
      <span class="entry__text">
        <span class="entry__title">竞赛招募</span>
        <span class="entry__desc">查看创新竞赛与队伍招募信息</span>
      </span>
      <span class="entry__arrow" aria-hidden="true">→</span>
    </RouterLink>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--info">已联调</span>
        项目数据的两个硬要求
      </p>
      <ul class="note-list">
        <li>项目 ID 是字符串主键（如 p-001），全程按字符串处理，不做 Number 或 parseInt。</li>
        <li>详情返回的字段与列表一致，项目没有正文字段，因此不虚构简介或详情内容。</li>
        <li>状态筛选在前端完成，因为后端尚未提供 status 查询参数的约定。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-card {
  display: flex;
  gap: 12px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.project-card__cover {
  flex: 0 0 76px;
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--c-surface-soft);
}

.project-card__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.project-card__head {
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

.project-card__time {
  flex: 1 1 auto;
  min-width: 0;
  text-align: right;
  font-size: 12px;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.project-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.project-card__tagline {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bar {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
  margin-top: 2px;
}

.bar__track {
  flex: 1 1 auto;
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
  transition: width 0.3s var(--ease);
}

.bar__num {
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-3);
}

.entry {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  color: inherit;
  text-decoration: none;
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
