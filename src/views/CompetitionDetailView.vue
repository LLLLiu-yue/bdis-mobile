<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const competitionId = computed(() => String(route.params.id ?? ''))

const fields = ['竞赛名称', '当前人数 / 目标人数', '招募角色', '截止时间', '联系方式']
</script>

<template>
  <div class="page">
    <div class="card">
      <p class="meta">竞赛 ID</p>
      <code class="competition-id">{{ competitionId }}</code>
      <p class="hint">与项目一致，字符串主键原样保留。</p>
    </div>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">招募信息</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card">
        <dl class="field-list">
          <div v-for="field in fields" :key="field" class="field">
            <dt class="field__label">{{ field }}</dt>
            <dd class="field__value">待接入</dd>
          </div>
        </dl>
      </div>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">约定</span>
        竞赛页不是论坛
      </p>
      <ul class="note-list">
        <li>接口沿用了 forum 命名，但当前只用于展示竞赛与招募。</li>
        <li>没有访客发帖、评论、点赞与报名接口，不放置对应按钮。</li>
        <li>截止时间只做原样展示，不在前端推断是否过期。</li>
      </ul>
    </div>

    <RouterLink class="btn btn--ghost" to="/competitions">返回招募列表</RouterLink>
  </div>
</template>

<style scoped>
.meta {
  font-size: 12px;
  color: var(--c-text-3);
}

.competition-id {
  display: block;
  margin-top: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--c-text-3);
}
</style>
