<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Transaction hash</span>
      <router-link :to="`/transactions/${transition.block}/${transition.hash}`">
        <TitledLink
          class="app-table__cell-txt"
          :text="'Ox' + transition.hash"
        />
      </router-link>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Type</span>
      <span class="app-table__cell-txt">{{ transition.type }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Block</span>
      <router-link :to="`/blocks/${transition.block}`">
        <TitledLink class="app-table__cell-txt" :text="transition.block" />
      </router-link>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Date and time</span>
      <span class="app-table__cell-txt">
        {{ convertToTxTime(transition.time) }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Sender</span>
      <router-link
        v-if="transition.sender !== ''"
        :to="`/account/${transition.sender}`"
      >
        <TitledLink
          class="app-table__cell-txt"
          :text="`0x${transition.sender}`"
        />
      </router-link>
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Receiver</span>
      <router-link
        v-if="transition.receiver !== ''"
        :to="`/account/${transition.receiver}`"
      >
        <TitledLink
          class="app-table__cell-txt"
          :text="`0x${transition.receiver}`"
        />
      </router-link>
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Amount</span>
      <span class="app-table__cell-txt">{{ transition.amount }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Transaction Fee</span>
      <span class="app-table__cell-txt">
        {{ transition.fee }}
      </span>
    </div>
  </div>
</template>
<script type="ts">
import { defineComponent } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { convertToTxTime } from '@/helpers/dates'

export default defineComponent({
  name: 'TransitionLine',
  components: { TitledLink },
  props: {
    transition: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      convertToTxTime,
    }
  },
})
</script>

<style scoped lang="scss">
.app-table__cell-txt {
  max-width: 150px;
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 200px;
  }
}
</style>
