<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Rank</span>
      <span>{{ rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Address</span>
      <TitledLink
        :to="`/account/${account.address}`"
        class="app-table__cell-txt"
        :text="`0x${account.address}`"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">GEO balance</span>
      <span>{{ geoBalance }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">GEO token percentage</span>
      <span v-if="accountOdinPercentage">{{ accountOdinPercentage }}%</span>
      <span v-else>No info</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">ODIN balance</span>
      <span>{{ odinBalance }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">ODIN token percentage</span>
      <div>
        <span v-if="accountGeoPercentage">{{ accountGeoPercentage }}%</span>
        <span v-else>No info</span>
      </div>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Transaction count</span>
      <div>
        <span v-if="account.total_tx">
          {{ account.total_tx }}
        </span>
        <span v-else>0</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { bigMath } from '@/helpers/bigMath'

export default defineComponent({
  components: { TitledLink },
  props: {
    account: {
      type: Object,
      required: true,
    },
    totalOdin: {
      type: Number,
      required: true,
    },
    totalGeo: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const geoBalance = computed(() =>
      bigMath.bigConvectOdinAndGeo(props.account.geoBalance)
    )
    const odinBalance = computed(() =>
      bigMath.bigConvectOdinAndGeo(props.account.odinBalance)
    )
    const accountOdinPercentage = computed(() => {
      return bigMath
        .multiply(
          bigMath.divide(props.account.odinBalance, props.totalOdin, {
            decimals: 3,
          }),
          100
        )
        .toString()
    })

    const accountGeoPercentage = computed(() => {
      return bigMath
        .multiply(
          bigMath.divide(props.account.geoBalance, props.totalGeo, {
            decimals: 8,
          }),
          100
        )
        .toString()
    })
    return {
      accountGeoPercentage,
      accountOdinPercentage,
      odinBalance,
      geoBalance,
    }
  },
})
</script>

<style scoped lang="scss">
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    5rem repeat(6, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(7, minmax(4rem, 1fr)) / auto;
  }
}

.app-table__cell-txt {
  max-width: 15rem;
  padding-right: 1rem;
}

.app-table__header {
  display: none;
  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 20rem;
  }
  @media screen and (max-width: 60rem) {
    width: 17rem;
  }
}
</style>
