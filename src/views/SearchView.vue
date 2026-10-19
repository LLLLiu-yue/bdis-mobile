<script setup>
import { computed, ref } from 'vue'

const keyword = ref('')
const notice = ref('')

const trimmedKeyword = computed(() => keyword.value.trim())

function onSubmit() {
  if (!trimmedKeyword.value) {
    notice.value = '请输入关键词后再搜索。'
    return
  }
  // 骨架阶段不请求接口，也不伪造搜索结果
  notice.value = `搜索「${trimmedKeyword.value}」的功能将在接口联调后开放，当前不返回示例结果。`
}
</script>

<template>
  <div class="page">
    <form class="search" role="search" @submit.prevent="onSubmit">
      <label class="sr-only" for="search-input">搜索关键词</label>
      <div class="search__row">
        <input
          id="search-input"
          v-model="keyword"
          class="search__input"
          type="search"
          name="q"
          placeholder="搜索新闻、公告与资料"
          autocomplete="off"
          enterkeyhint="search"
        />
        <button type="submit" class="search__submit">搜索</button>
      </div>
      <p v-if="notice" class="search__notice" role="status">{{ notice }}</p>
    </form>

    <div class="note-card">
      <p class="note-card__title">
        <span class="pill pill--pending">待接入</span>
        搜索范围
      </p>
      <ul class="note-list">
        <li>只检索新闻、公告的标题与摘要，以及资料的标题与描述。</li>
        <li>不检索项目、竞赛、成员，也不检索新闻正文。</li>
        <li>结果按类型跳转：公告进公告详情，不会被误带到新闻详情。</li>
        <li>连续输入时做防抖处理，避免旧响应覆盖新结果。</li>
      </ul>
    </div>

    <section class="section">
      <div class="section__head">
        <h2 class="section__title">搜索结果</h2>
        <span class="section__aside">接口接入后展示</span>
      </div>
      <div class="card empty-preview">
        <span class="empty-preview__icon" aria-hidden="true">⌕</span>
        <p class="empty-preview__text">输入关键词后，结果会在这里按分类展示。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.search__row {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.search__input {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 46px;
  padding: 0 14px;
  font-size: 16px; /* 不小于 16px，避免 iOS 聚焦时自动放大页面 */
  color: var(--c-text);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  outline: none;
}

.search__input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px var(--c-primary-soft);
}

.search__input::placeholder {
  color: var(--c-text-3);
}

.search__submit {
  flex: none;
  min-height: 46px;
  padding: 0 18px;
  color: #fff;
  background: var(--c-primary);
  border: 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.search__submit:active {
  transform: scale(0.97);
}

.search__notice {
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--c-text-2);
  overflow-wrap: anywhere;
  background: var(--c-warn-soft);
  border-radius: 10px;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  padding: 26px 16px;
  text-align: center;
}

.empty-preview__icon {
  font-size: 24px;
  color: var(--c-text-3);
}

.empty-preview__text {
  font-size: 13px;
  color: var(--c-text-3);
}
</style>
