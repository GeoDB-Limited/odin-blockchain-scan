<template>
  <button class="block-back" @click.prevent="routerBack(currentRouter)">
    <img src="~@/assets/icons/back-arrow.svg" alt="info" />
  </button>
</template>

<script lang="ts">
import { routerBack } from '@/router'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BackButton',
  props: {
    currentRouter: { required: true },
  },
  setup() {
    return { routerBack }
  },
})
</script>
