<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import { getBanners, normalizeBanners } from '@/api/home.js'
import { getLabInfo } from '@/api/lab.js'
import { getNewsList } from '@/api/news.js'

const quickLinks = [
  { to: '/updates', title: '动态', desc: '新闻与公告' },
  { to: '/projects', title: '项目', desc: '在研与招募' },
  { to: '/competitions', title: '竞赛', desc: '组队与招募' },
  { to: '/about', title: '关于', desc: '实验室与团队' },
]

// —— 首页轮播（/api/banner，只做展示，不放 buttonLink 按钮） ——
const banners = ref([])
async function loadBanners() {
  try {
    banners.value = normalizeBanners(await getBanners())
  } catch (e) {
    // 轮播加载失败不阻塞首页其他区块，静默降级为不展示
    banners.value = []
  }
}

// —— 实验室信息：hero 标题与简介优先用后端数据，没给就用默认文案 ——
const labName = ref('')
const labIntro = ref('')
async function loadLabInfo() {
  try {
    const data = await getLabInfo()
    if (data) {
      labName.value = data.name || ''
      labIntro.value = data.introShort || ''
    }
  } catch (e) {
    // 同上，失败保持默认文案
  }
}

// —— 最新动态：取 3 条真实新闻，失败/为空则整块收起说明 ——
const newsTop = ref([])
const newsLoading = ref(false)
async function loadNewsTop() {
  newsLoading.value = true
  try {
    const data = await getNewsList(3)
    const list = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : []
    newsTop.value = list.slice(0, 3)
  } catch (e) {
    newsTop.value = []
  } finally {
    newsLoading.value = false
  }
}

function newsDate(item) {
  return item.publishDate || item.publish_date || ''
}

function hideImage(e) {
  e.target.style.display = 'none'
}

loadBanners()
loadLabInfo()
loadNewsTop()
</script>

<template>
  <div class="page">
    <section class="hero">
      <span class="hero__tag">BDIS</span>
      <h2 class="hero__title">{{ labName || '大数据智能工作室' }}</h2>
      <p v-if="labIntro" class="hero__desc">{{ labIntro }}</p>
      <div class="hero__actions">
        <RouterLink class="btn hero__btn hero__btn--solid" to="/updates">看看动态</RouterLink>
        <RouterLink class="btn hero__btn hero__btn--outline" to="/about">了解我们</RouterLink>
      </div>
    </section>

    <!-- 轮播：来自 /api/banner，横向滑动查看；无数据时整块不渲染 -->
    <section v-if="banners.length" class="section" aria-label="轮播图">
      <div class="banner-track" role="group">
        <article v-for="banner in banners" :key="banner.id" class="banner">
          <img
            v-if="banner.imageUrl"
            :src="banner.imageUrl"
            class="banner__img"
            alt=""
            referrerpolicy="no-referrer"
            @error="hideImage"
          />
          <div class="banner__body">
            <h3 class="banner__title">{{ banner.title }}</h3>
            <p v-if="banner.subtitle" class="banner__subtitle">{{ banner.subtitle }}</p>
            <p v-if="banner.description" class="banner__desc">{{ banner.description }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">快捷入口</h2>
      </div>
      <ul class="tile-grid">
        <li v-for="link in quickLinks" :key="link.to">
          <RouterLink class="tile" :to="link.to">
            <span class="tile__title">{{ link.title }}</span>
            <span class="tile__desc">{{ link.desc }}</span>
            <span class="tile__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">最新动态</h2>
        <RouterLink class="section__aside" to="/updates">查看全部 →</RouterLink>
      </div>

      <div v-if="newsLoading" class="card">
        <span class="skeleton-line" style="width: 86%" />
        <span class="skeleton-line skeleton-line--soft" style="width: 62%" />
      </div>

      <ul v-else-if="newsTop.length" class="card news-top">
        <li v-for="item in newsTop" :key="item.id" class="news-top__row">
          <RouterLink :to="`/news/${item.id}`" class="news-top__link">
            <span class="news-top__title">{{ item.title }}</span>
            <span class="news-top__date">{{ newsDate(item) }}</span>
          </RouterLink>
        </li>
      </ul>

      <div v-else class="card">
        <p class="hint">暂无最新动态，去「动态」页看看新闻与公告吧。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 22px 18px 20px;
  color: #fff;
  background: linear-gradient(135deg, #16224a 0%, #2b5cff 62%, #4d8bff 100%);
  border-radius: var(--radius-lg);
  box-shadow: 0 18px 38px -26px rgba(27, 42, 94, 0.9);
}

.hero::after {
  position: absolute;
  top: -46px;
  right: -36px;
  width: 150px;
  height: 150px;
  content: "";
  background: rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  pointer-events: none;
}

.hero__tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  margin-bottom: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
}

.hero__title {
  position: relative;
  font-size: 23px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.01em;
  overflow-wrap: anywhere;
}

.hero__desc {
  position: relative;
  max-width: 30em;
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
}

.hero__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.hero__btn {
  flex: 1 1 auto;
  min-width: 112px;
}

.hero__btn--solid {
  color: var(--c-primary-strong);
  background: #fff;
}

.hero__btn--outline {
  color: #fff;
  background: transparent;
  border-color: rgba(255, 255, 255, 0.5);
}

/* 轮播：scroll-snap 横向滑动，不写定时器，滚到哪算哪 */
.banner-track {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
}

.banner {
  flex: 0 0 100%;
  scroll-snap-align: start;
  overflow: hidden;
  background: var(--c-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.banner__img {
  display: block;
  width: 100%;
  max-height: 170px;
  object-fit: cover;
}

.banner__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px 14px;
}

.banner__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.banner__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--c-primary);
  overflow-wrap: anywhere;
}

.banner__desc {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 84px;
  padding: 14px;
  background: var(--c-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s var(--ease);
}

.tile:active {
  transform: scale(0.98);
}

.tile__title {
  font-size: 15px;
  font-weight: 600;
}

.tile__desc {
  font-size: 12px;
  color: var(--c-text-3);
}

.tile__arrow {
  margin-top: auto;
  padding-top: 8px;
  font-size: 14px;
  color: var(--c-primary);
}

.news-top {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.news-top__row + .news-top__row {
  border-top: 1px solid var(--c-border);
}

.news-top__link {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 8px 0;
  color: inherit;
  text-decoration: none;
}

.news-top__title {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-top__date {
  flex: 0 0 auto;
  font-size: 11px;
  color: var(--c-text-3);
}

.hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}
</style>
