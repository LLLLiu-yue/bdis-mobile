<script setup>
import { ref, computed } from 'vue'
import RequestState from '@/components/RequestState.vue'
import {
  getResourceList,
  categoryText,
  safeHttpUrl,
  RESOURCE_CATEGORIES,
  PAGE_SIZE,
} from '@/api/resources.js'

const items = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)
const error = ref('')

// 后端的 category 参数真实可用，所以分类切换走后端查询，不在前端做假筛选
const activeCategory = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

function setCategory(key) {
  if (activeCategory.value === key) return
  activeCategory.value = key
  // 换分类必须把页码重置回第 1 页，否则会请求一个不存在的页码
  page.value = 1
  load()
}

function goPage(next) {
  const target = Math.min(totalPages.value, Math.max(1, next))
  if (target === page.value) return
  page.value = target
  load()
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getResourceList({
      page: page.value,
      limit: PAGE_SIZE,
      category: activeCategory.value,
    })
    // 后端返回 { total, limit, page, list }
    const list = Array.isArray(data?.list) ? data.list : []
    const count = Number(data?.total)
    items.value = list
    total.value = Number.isFinite(count) ? count : list.length
  } catch (e) {
    error.value = e.message || '资料加载失败，请重试'
    items.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

load()
</script>

<template>
  <div class="page">
    <p class="page-lead">按分类浏览学习资料，资料通过外链打开，站内不复制正文。</p>

    <div class="chips" role="group" aria-label="资料分类">
      <button
        v-for="item in RESOURCE_CATEGORIES"
        :key="item.key || 'all'"
        type="button"
        class="chip"
        :class="{ 'chip--active': activeCategory === item.key }"
        :aria-pressed="activeCategory === item.key"
        @click="setCategory(item.key)"
      >
        {{ item.label }}
      </button>
    </div>

    <RequestState
      :loading="loading"
      :error="error"
      :empty="items.length === 0"
      empty-title="暂无该分类资料"
      empty-text="换个分类看看，或稍后再来，工作室会持续补充学习资源"
      :skeleton-rows="5"
      @retry="load"
    >
      <ul class="resource-list">
        <li v-for="item in items" :key="item.id" class="card resource">
          <div class="resource__head">
            <span class="resource__tag">{{ categoryText(item.category) }}</span>
          </div>
          <h3 class="resource__title">{{ item.title }}</h3>
          <p v-if="item.description" class="resource__desc">{{ item.description }}</p>

          <!-- 只有 http/https 外链才渲染成可点的链接；
               其它情况显示说明文字，绝不留下点了没反应的假按钮 -->
          <a
            v-if="safeHttpUrl(item.link)"
            class="resource__link"
            :href="safeHttpUrl(item.link)"
            target="_blank"
            rel="noopener noreferrer"
          >
            打开链接
            <span aria-hidden="true">↗</span>
          </a>
          <p v-else class="resource__nolink">暂无线上访问入口</p>
        </li>
      </ul>

      <!-- 分页：总数不足一页时不渲染，避免出现无用的页码控件 -->
      <div v-if="totalPages > 1" class="pager">
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
      </div>
    </RequestState>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--info">已联调</span>
        资料页的交互规则
      </p>
      <ul class="note-list">
        <li>分页使用 page / limit / total，后端返回条数不足一页时不显示页码控件。</li>
        <li>切换分类时页码重置为第 1 页，避免请求到空页。</li>
        <li>外链只允许 http 与 https，其他情况显示“暂无线上访问入口”。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.resource {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.resource__head {
  display: flex;
  min-width: 0;
}

.resource__tag {
  flex: 0 0 auto;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-primary-soft);
}

.resource__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.resource__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.resource__link {
  align-self: flex-start;
  min-height: 36px;
  margin-top: 4px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: var(--c-primary);
  text-decoration: none;
}

.resource__link:active {
  transform: scale(0.98);
}

.resource__nolink {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--c-text-3);
}

.pager {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
}

.pager__btn {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface);
  color: var(--c-text-2);
  font-size: 13px;
}

.pager__btn:disabled {
  color: var(--c-text-3);
  opacity: 0.5;
}

.pager__info {
  min-width: 56px;
  text-align: center;
  font-size: 13px;
  color: var(--c-text-3);
}
</style>
