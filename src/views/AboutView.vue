<script setup>
import { ref } from 'vue'
import RequestState from '@/components/RequestState.vue'
import { getLabInfo, getLabTeam } from '@/api/lab.js'

// —— 实验室信息（独立一段请求状态，失败不影响成员区） ——
const info = ref(null)
const infoLoading = ref(false)
const infoError = ref('')

async function loadInfo() {
  infoLoading.value = true
  infoError.value = ''
  try {
    const data = await getLabInfo()
    // data 为 null：接口正常但没内容，按空态处理，不当报错
    info.value = data ?? null
    if (data == null) infoError.value = ''
  } catch (e) {
    infoError.value = e.message || '实验室信息加载失败，请重试'
    info.value = null
  } finally {
    infoLoading.value = false
  }
}

// —— 团队成员（独立请求） ——
const team = ref([])
const teamLoading = ref(false)
const teamError = ref('')

async function loadTeam() {
  teamLoading.value = true
  teamError.value = ''
  try {
    const data = await getLabTeam()
    const list = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : []
    team.value = list
  } catch (e) {
    teamError.value = e.message || '团队成员加载失败，请重试'
    team.value = []
  } finally {
    teamLoading.value = false
  }
}

// labDesc 是带换行的纯文本，模板里用 pre-line 样式直接插值即可
function introText() {
  return info.value?.labDesc || info.value?.lab_desc || ''
}

// 邮箱只放行像样的邮箱格式，防止后端塞进奇怪内容变成假链接
function emailLink() {
  const value = (info.value?.email || '').trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? `mailto:${value}` : ''
}

function hideImage(e) {
  e.target.style.display = 'none'
}

loadInfo()
loadTeam()
</script>

<template>
  <div class="page">
    <p class="page-lead">实验室介绍与团队成员，全部来自后端真实数据。</p>

    <!-- 实验室简介 -->
    <section class="section">
      <div class="section__head">
        <h2 class="section__title">实验室简介</h2>
      </div>
      <RequestState
        :loading="infoLoading"
        :error="infoError"
        :empty="!infoLoading && !infoError && !info"
        empty-title="暂无实验室介绍"
        empty-text="内容准备中，稍后再来看看"
        :skeleton-rows="4"
        @retry="loadInfo"
      >
        <article v-if="info" class="card about-intro">
          <img
            v-if="info.logoUrl || info.picture"
            :src="info.logoUrl || info.picture"
            class="about-intro__logo"
            alt=""
            referrerpolicy="no-referrer"
            @error="hideImage"
          />
          <h3 v-if="info.name" class="about-intro__name">{{ info.name }}</h3>
          <p v-if="info.nameEn" class="about-intro__name-en">{{ info.nameEn }}</p>
          <p v-if="introText()" class="about-intro__desc">{{ introText() }}</p>

          <!-- 联系方式：后端没给值就整行不渲染，不许出现空标签 -->
          <ul v-if="info.address || emailLink() || info.qqGroup" class="about-intro__contacts">
            <li v-if="info.address">
              <span class="about-intro__label">地址</span>
              <span>{{ info.address }}</span>
            </li>
            <li v-if="emailLink()">
              <span class="about-intro__label">邮箱</span>
              <a :href="emailLink()">{{ info.email }}</a>
            </li>
            <li v-if="info.qqGroup">
              <span class="about-intro__label">QQ群</span>
              <span>{{ info.qqGroup }}</span>
            </li>
          </ul>
        </article>
      </RequestState>
    </section>

    <!-- 团队成员 -->
    <section class="section">
      <div class="section__head">
        <h2 class="section__title">团队成员</h2>
        <span v-if="team.length" class="section__aside">{{ team.length }} 人</span>
      </div>
      <RequestState
        :loading="teamLoading"
        :error="teamError"
        :empty="team.length === 0"
        empty-title="暂无成员信息"
        empty-text="成员名单稍后更新"
        :skeleton-rows="3"
        @retry="loadTeam"
      >
        <ul class="card member-list">
          <li v-for="member in team" :key="member.id" class="member">
            <!-- 约一半成员没有头像：用姓名首字做占位，不留灰框/裂图 -->
            <img
              v-if="member.avatarUrl"
              :src="member.avatarUrl"
              class="member__avatar"
              alt=""
              referrerpolicy="no-referrer"
              @error="hideImage"
            />
            <span v-else class="member__avatar member__avatar--fallback" aria-hidden="true">
              {{ (member.name || '?').slice(0, 1) }}
            </span>

            <div class="member__body">
              <p class="member__name">
                {{ member.name }}
                <span v-if="member.role" class="member__role">{{ member.role }}</span>
              </p>
              <p v-if="member.description" class="member__desc">{{ member.description }}</p>
            </div>
          </li>
        </ul>
      </RequestState>
    </section>
  </div>
</template>

<style scoped>
.about-intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about-intro__logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--c-surface-soft);
}

.about-intro__name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.about-intro__name-en {
  margin: 0;
  font-size: 12px;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}

/* labDesc 是带 \n 的纯文本：pre-line 保留换行，不用 v-html */
.about-intro__desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--c-text-2);
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.about-intro__contacts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 4px 0 0;
  padding: 10px 0 0;
  border-top: 1px solid var(--c-border);
  font-size: 13px;
  list-style: none;
}

.about-intro__contacts li {
  display: flex;
  gap: 10px;
  min-width: 0;
  overflow-wrap: anywhere;
}

.about-intro__label {
  flex: 0 0 auto;
  color: var(--c-text-3);
}

.about-intro__contacts a {
  color: var(--c-primary);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.member {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-width: 0;
}

.member + .member {
  padding-top: 14px;
  border-top: 1px solid var(--c-border);
}

.member__avatar {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 50%;
  background: #eef1f7;
}

.member__avatar--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-primary);
  font-size: 16px;
  font-weight: 700;
  background: var(--c-primary-soft);
}

.member__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.member__name {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.member__role {
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-primary-soft);
  border-radius: 999px;
}

.member__desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
  overflow-wrap: anywhere;
}
</style>
