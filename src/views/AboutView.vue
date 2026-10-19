<template>
  <div class="page">
    <p class="page-lead">实验室简介、研究方向与团队成员统一来自实验室信息与团队接口。</p>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">实验室简介</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card about-intro">
        <span class="skeleton-line" style="width: 92%" />
        <span class="skeleton-line" style="width: 100%" />
        <span class="skeleton-line" style="width: 76%" />
        <p class="hint">简介字段缺失时展示空状态，不复制桌面端写死的介绍文案。</p>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">研究方向</h2>
      </div>
      <ul class="card direction-list">
        <li v-for="n in 3" :key="n" class="direction">
          <span class="direction__index">{{ String(n).padStart(2, '0') }}</span>
          <span class="ghost-body">
            <span class="skeleton-line" :style="{ width: n === 2 ? '58%' : '72%' }" />
            <span class="skeleton-line skeleton-line--soft" style="width: 88%" />
          </span>
        </li>
      </ul>
    </section>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">团队成员</h2>
        <span class="section__aside">暂无排序字段</span>
      </div>
      <ul class="card member-list">
        <li v-for="n in 2" :key="n" class="member">
          <span class="member__avatar" aria-hidden="true" />
          <span class="ghost-body">
            <span class="skeleton-line" style="width: 42%" />
            <span class="skeleton-line skeleton-line--soft" style="width: 64%" />
          </span>
        </li>
      </ul>
      <p class="hint">成员姓名、角色与头像待接口接入；字段为空时不展示空白卡片。</p>
    </section>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        联系方式以后端数据为准
      </p>
      <ul class="note-list">
        <li>邮箱、地址、群号从实验室信息接口读取，不在前端写死。</li>
        <li>接口缺值时先向负责人核实，不沿用桌面端的硬编码文案。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.direction-list,
.member-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.direction,
.member {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-width: 0;
}

.direction + .direction,
.member + .member {
  padding-top: 14px;
  border-top: 1px solid var(--c-border);
}

.direction__index {
  flex: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-primary);
}

.member__avatar {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  background: #eef1f7;
  border-radius: 50%;
}

.hint {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-3);
}
</style>
