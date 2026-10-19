<script setup>
// 第一期预留页：不请求任何不存在的接口，只展示筹备说明
const stages = [
  { title: '基础能力', desc: '语言基础、数据结构、数据库与网络常识。' },
  { title: '工程实践', desc: '项目结构、版本协作、调试与部署流程。' },
  { title: '方向深入', desc: '大数据处理与智能应用的进阶主题。' },
  { title: '项目实战', desc: '进入在研项目，按真实需求完成模块开发。' },
]
</script>

<template>
  <div class="page">
    <section class="card intro">
      <span class="pill pill--pending">筹备中</span>
      <h2 class="intro__title">技术成长路线持续筹备中</h2>
      <p class="intro__desc">
        这一页是第一期预留的扩展位，内容来源与阶段划分确认后再补充，当前不请求任何后端接口。
      </p>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">阶段规划</h2>
        <span class="section__aside">内容待确认</span>
      </div>
      <ol class="card timeline">
        <li v-for="(stage, index) in stages" :key="stage.title" class="timeline__item">
          <span class="timeline__dot" aria-hidden="true" />
          <p class="timeline__title">
            <span class="timeline__index">{{ String(index + 1).padStart(2, '0') }}</span>
            {{ stage.title }}
          </p>
          <p class="timeline__desc">{{ stage.desc }}</p>
        </li>
      </ol>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--info">扩展说明</span>
        后续怎么接
      </p>
      <ul class="note-list">
        <li>只补静态内容时，直接修改本页即可，不动布局与路由。</li>
        <li>后端提供接口后，新增 src/api/growth.js，并在本页绑定加载状态。</li>
        <li>路由 /growth 与“更多”入口已经就位，无需重新注册。</li>
      </ul>
    </div>

    <RouterLink class="btn btn--ghost" to="/">返回首页</RouterLink>
  </div>
</template>

<style scoped>
.intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.intro__title {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.intro__desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--c-text-2);
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline__item {
  position: relative;
  padding: 0 0 18px 22px;
  margin-left: 6px;
  border-left: 2px dashed var(--c-border);
}

.timeline__item:last-child {
  padding-bottom: 0;
  border-left-color: transparent;
}

.timeline__dot {
  position: absolute;
  top: 5px;
  left: -7px;
  width: 12px;
  height: 12px;
  background: var(--c-surface);
  border: 2px solid var(--c-primary);
  border-radius: 50%;
}

.timeline__title {
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 15px;
  font-weight: 600;
}

.timeline__index {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-primary);
  letter-spacing: 0.04em;
}

.timeline__desc {
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-2);
}
</style>
