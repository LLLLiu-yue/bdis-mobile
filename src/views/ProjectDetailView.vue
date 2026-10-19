<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = computed(() => String(route.params.id ?? ''))

const fields = ['项目名称', '副标题', '当前状态', '更新时间', '招募角色', '项目成员']
</script>

<template>
  <div class="page">
    <div class="card">
      <p class="meta">项目 ID</p>
      <code class="project-id">{{ projectId }}</code>
      <p class="hint">长字符串主键原样展示，不做数字转换。</p>
    </div>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">项目信息</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card">
        <dl class="field-list">
          <div v-for="field in fields" :key="field" class="field">
            <dt class="field__label">{{ field }}</dt>
            <dd class="field__value">待接入</dd>
          </div>
        </dl>
        <div class="progress-block">
          <span class="progress-block__label">研发进度</span>
          <div class="progress" aria-hidden="true" />
        </div>
      </div>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">约定</span>
        不虚构后端没有的字段
      </p>
      <ul class="note-list">
        <li>项目实体没有正文或长介绍字段，第一版只展示已有信息。</li>
        <li>成员与角色为空时展示“暂无”，不让页面因为空数组报错。</li>
        <li>连续打开两个不同项目时按路由参数重新请求，避免内容不刷新。</li>
      </ul>
    </div>

    <RouterLink class="btn btn--ghost" to="/projects">返回项目列表</RouterLink>
  </div>
</template>

<style scoped>
.meta {
  font-size: 12px;
  color: var(--c-text-3);
}

.project-id {
  display: block;
  margin-top: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  color: var(--c-text);
  overflow-wrap: anywhere;
}

.hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--c-text-3);
}

.progress-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.progress-block__label {
  font-size: 13px;
  color: var(--c-text-3);
}
</style>
