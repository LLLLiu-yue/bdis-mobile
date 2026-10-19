<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const scrollEl = ref(null)

const pageTitle = computed(() => route.meta.title || '大数据智能工作室')
const showBack = computed(() => route.meta.back === true)
const backTo = computed(() => route.meta.backTo || '/')

// 单页应用切换路由时浏览器不会自动回到顶部，这里手动把内容区滚回起点
watch(
  () => route.path,
  async () => {
    await nextTick()
    scrollEl.value?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  },
)
</script>

<template>
  <div class="mobile-layout">
    <PageHeader :title="pageTitle" :show-back="showBack" :back-to="backTo" />

    <!--
      用 Flex 做“上下固定、中间滚动”：头尾是 flex:none 的固定高度项，
      内容区 flex:1 + min-height:0 独立滚动。这样正文永远不会被底部导航遮住，
      也不需要给内容额外补一大块 padding-bottom。
    -->
    <main ref="scrollEl" class="mobile-layout__scroll" id="main-content">
      <div class="mobile-layout__inner">
        <h1 class="sr-only">{{ pageTitle }}</h1>

        <RouterView v-slot="{ Component }">
          <Transition name="route-fade" mode="out-in">
            <component :is="Component" :key="route.name" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<style scoped>
.mobile-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  background: var(--c-bg);
}

.mobile-layout__scroll {
  flex: 1 1 auto;
  min-width: 0;
  /* 关键：只有纵向滚动容器是 auto，横向保持 auto 而不是 hidden，
     一旦哪里真的撑宽了，横向滚动条会如实出现，方便在自测阶段发现并修掉 */
  min-height: 0;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

.mobile-layout__inner {
  width: 100%;
  max-width: 100%;
  padding: 14px calc(clamp(12px, 4.2vw, 20px) + env(safe-area-inset-right, 0px)) 22px
    calc(clamp(12px, 4.2vw, 20px) + env(safe-area-inset-left, 0px));
}

/* 桌面浏览器预览时收成一条手机宽度的单列，方便按 320/390/430 逐档检查 */
@media (min-width: 700px) {
  .mobile-layout {
    max-width: 640px;
    margin-inline: auto;
    box-shadow: 0 0 0 1px var(--c-border), 0 30px 70px -50px rgba(22, 32, 47, 0.6);
  }
}
</style>
