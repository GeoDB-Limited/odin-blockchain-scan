<template>
  <transition name="fade" mode="out-in">
    <div class="info-panel" v-if="priceData && transactionData">
      <InfoPanelCol :key="'priceData'" :infoPanelRows="priceData" />
      <InfoPanelCol :key="'transactionData'" :infoPanelRows="transactionData" />
      <div class="info-panel__chart">
        <div class="info-panel__title">Transactions history statistics</div>

        <LineChartD3
          v-if="chartData"
          :chart="chartData"
          :margin="chartMargin"
          :key="'chartData'"
        ></LineChartD3>

        <span v-else class="info-panel__empty-chart">
          Insufficient data to visualize
        </span>
      </div>
    </div>
    <div v-else class="info-panel">
      <span class="info-panel__empty">Waiting to receive data</span>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import InfoPanelCol from '@/components/InfoPanel/InfoPanelCol.vue'
import { CoingeckoCoinsType, Link } from '@/helpers/Types'
import { getAPIDate } from '@/helpers/requests'
import { handleError } from '@/helpers/errors'
import { callers } from '@/api/callers'

import LineChartD3 from '@/components/Charts/LineChartd3.vue'
export default defineComponent({
  name: 'InfoPanel',
  components: { InfoPanelCol, LineChartD3 },
  setup() {
    const priceData = ref<Array<Link> | null>()
    const transactionData = ref<Array<Link> | null>()
    const transactionCount = ref<number>()
    const chartDataLoad = ref(false)
    const chartData = ref()
    const chartMargin = ref({
      top: 10,
      right: 10,
      bottom: 21,
      left: 10,
    })

    const getLatestTelemetry = async (): Promise<void> => {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 1)

      let tempArr: Array<number> = []

      const { data } = await callers.getTxVolumePerDays(startDate, endDate)
      if (data) {
        data.map((el) => {
          el.date = new Date(el.date)
          el['value'] = el.volume
          delete el.volume
        })
        chartData.value = data
        chartData.value.map((el) => {
          tempArr = [...tempArr, el.value]
        })
        transactionCount.value = tempArr.reduce(
          (previousValue: number, currentValue: number): number =>
            previousValue + currentValue
        )
      }

      await getCoinInfo()
      chartDataLoad.value = true
    }

    const getCoinInfo = async (): Promise<void> => {
      const {
        data: {
          name: odinName,
          market_data: {
            current_price: { usd: odinUSD },
            market_cap: { usd: odinMarketCapUSD },
          },
        },
      } = (await getAPIDate(
        `${process.env.VUE_APP_COINGECKO_API}/coins/odin-protocol`
      )) as CoingeckoCoinsType
      const {
        data: {
          name: geoDBName,
          market_data: {
            current_price: { usd: geoDBUSD },
            market_cap: { usd: geoDBMarketCapUSD },
          },
        },
      } = (await getAPIDate(
        `${process.env.VUE_APP_COINGECKO_API}/coins/geodb`
      )) as CoingeckoCoinsType

      transactionData.value = [
        {
          title: 'Total number of transactions',
          text: `${transactionCount.value ?? 'Insufficient data'}`,
        },
        {
          title: 'Market CAP',
          text: `$${odinMarketCapUSD + geoDBMarketCapUSD}`,
        },
      ]

      priceData.value = [
        { title: odinName, text: `$${odinUSD}` },
        { title: geoDBName, text: `$${geoDBUSD}` },
      ]
    }

    onMounted(async () => {
      try {
        await getLatestTelemetry()
      } catch (error) {
        handleError(error)
        console.error(error)
      }
    })

    return {
      chartDataLoad,
      chartData,
      chartMargin,
      transactionData,
      priceData,
    }
  },
})
</script>

<style lang="scss">
.info-panel {
  &__empty {
    grid-column-start: 1;
    grid-column-end: -1;
    color: var(--clr__input-border);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3.2rem;
    font-weight: 600;
    text-transform: uppercase;
    &-chart {
      color: var(--clr__input-border);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3.4rem;
      font-weight: 600;
      text-transform: uppercase;
      height: 100%;
      @media (max-width: 48rem) {
        text-align: center;
        font-size: 2.4rem;
      }
    }
  }
  display: grid;
  grid: auto/ repeat(2, 1fr) 2fr;
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid var(--clr__action);
  width: 100%;
  margin-bottom: 3.2rem;
  &__title {
    margin-bottom: 1.53rem;
    font-size: 1.4rem;
    font-weight: 300;
  }
  &__text {
    font-weight: 600;
    font-size: 1.6rem;
    line-height: 2.4rem;
  }
  &__row {
    &:not(&:last-child) {
      margin-bottom: 3.2rem;
    }
  }
  &__chart,
  &__chart > .chart-wrapper {
    height: 26.9rem;
  }
  @media (max-width: 768px) {
    grid: auto / repeat(2, 1fr);
    gap: 2.4rem;
    &__title {
      margin-bottom: 0.8rem;
    }
    &__chart {
      grid-column: 1/-1;
    }
  }
}
</style>
