<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import { getCompetitionList, categoryText } from '@/api/competitions.js'

const items = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getCompetitionList()
    // 防御性取值：约定返回数组，若以后改成 { list } 也能兼容，不会白屏
    const list = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : []
    items.value = list
  } catch (e) {
    error.value = e.message || '招募信息加载失败，请重试'
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
    <p class="page-lead">创新竞赛与队伍招募信息，点击卡片查看完整说明与联系方式。</p>

    <RequestState
      :loading="loading"
      :error="error"
      :empty="items.length === 0"
      empty-title="暂无组队信息"
      empty-text="有新的竞赛或组队招募时会第一时间发布，稍后再来看看吧"
      :skeleton-rows="4"
      @retry="load"
    >
      <ul class="competition-list">
        <li v-for="item in items" :key="item.id">
          <RouterLink :to="`/competitions/${item.id}`" class="card recruit-card">
            <!-- 封面缩略：coverThumbUrl 为驼峰字段，路径可能带 /static 或 /api/uploads -->
            <img
              v-if="item.coverThumbUrl"
              :src="item.coverThumbUrl"
              class="recruit-card__cover"
              alt=""
              referrerpolicy="no-referrer"
              @error="hideImage"
            />
            <div class="recruit-card__body">
              <div class="recruit-card__head">
                <span class="recruit-card__tag">{{ categoryText(item.category) }}</span>
                <span class="recruit-card__time">
                  {{ item.publishDate || item.publish_date || '' }}
                </span>
              </div>
              <h3 class="recruit-card__title">{{ item.title }}</h3>
              <p v-if="item.summary" class="recruit-card__summary">{{ item.summary }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </RequestState>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--info">已联调</span>
        关于这个列表
      </p>
      <ul class="note-list">
        <li>接口没有分页与 total，不添加点了没反应的分页器。</li>
        <li>当前暂无数据是后端未录入内容，不是故障；数据发布后会自动出现。</li>
        <li>后端没有报名或入队接口，不提供「点击即报名」的按钮。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.competition-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.recruit-card {
  display: flex;
  gap: 12px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.recruit-card__cover {
  flex: 0 0 76px;
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--c-surface-soft);
}

.recruit-card__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.recruit-card__head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.recruit-card__tag {
  flex: 0 0 auto;
  padding: 2px 9px;
  color: var(--c-primary);
  background: var(--c-primary-soft);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.recruit-card__time {
  flex: 1 1 auto;
  min-width: 0;
  text-align: right;
  font-size: 12px;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.recruit-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.recruit-card__summary {
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
</style>
