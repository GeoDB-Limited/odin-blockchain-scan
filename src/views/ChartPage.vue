<template>
  <div class="chart">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :key="Component" :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

export default defineComponent({
  name: 'ChartPage',
  setup() {
    const chartData = ref<string>()
    const route: RouteLocationNormalizedLoaded = useRoute()

    onMounted(async (): Promise<void> => {
      chartData.value = 'asd'
    })

    return {
      chartData,
      route,
    }
  },
})
</script>

<style scoped></style>
