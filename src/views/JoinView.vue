<script setup>
const steps = [
  {
    title: '了解方向',
    desc: '先浏览项目与学习资料，确认自己想投入的技术方向。',
  },
  {
    title: '准备材料',
    desc: '整理个人简历与做过的项目说明，准备一段能讲清楚的成果介绍。',
  },
  {
    title: '投递申请',
    desc: '通过实验室官方邮箱提交，邮件主题写明姓名与意向方向。',
  },
]

const contacts = [
  { label: '官方邮箱', value: '待接入' },
  { label: 'QQ 群', value: '待接入' },
  { label: '实验室地址', value: '待接入' },
]
</script>

<template>
  <div class="page">
    <p class="page-lead">加入流程分三步，联系信息以实验室信息接口为准。</p>

    <ol class="card steps">
      <li v-for="(step, index) in steps" :key="step.title" class="step">
        <span class="step__index" aria-hidden="true">{{ index + 1 }}</span>
        <div class="step__body">
          <p class="step__title">{{ step.title }}</p>
          <p class="step__desc">{{ step.desc }}</p>
        </div>
      </li>
    </ol>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">联系方式</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card">
        <dl class="field-list">
          <div v-for="item in contacts" :key="item.label" class="field">
            <dt class="field__label">{{ item.label }}</dt>
            <dd class="field__value">{{ item.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">报名表下载</h2>
      </div>
      <div class="card download">
        <p class="download__desc">
          需要先确认文件来源真实可靠、地址可公开访问，确认之前不放置下载按钮。
        </p>
        <button type="button" class="btn btn--ghost" disabled>暂未开放下载</button>
      </div>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">暂不开放</span>
        在线简历收集
      </p>
      <ul class="note-list">
        <li>后端已有简历提交接口，但第一版不开放真实简历收集。</li>
        <li>需要等附件访问方式、同名覆盖与测试环境等前置条件确认后单独排期。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-width: 0;
}

.step + .step {
  padding-top: 16px;
  border-top: 1px solid var(--c-border);
}

.step__index {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--c-primary-soft);
  color: var(--c-primary-strong);
  font-size: 12px;
  font-weight: 700;
}

.step__body {
  min-width: 0;
}

.step__title {
  font-size: 15px;
  font-weight: 600;
}

.step__desc {
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-2);
}

.download {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.download__desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--c-text-2);
}
</style>
