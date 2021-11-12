<template>
  <div>
    <div class="title">
      <BackButton :current-router="router" text="" />
      <h1 class="title-name">Daily Transactions Volume Chart</h1>
    </div>
    <div class="sort-wrapper" v-if="!isLoading">
      <span>
        Transactions<br />
        per Day
      </span>
      <VuePicker
        class="app-form__field-input app-filter app-filter--coin"
        name="filter"
        v-model="sortingValue"
        :isDisabled="isLoading"
      >
        <template #dropdownInner>
          <div class="app-filter__dropdown-inner">
            <VuePickerOption
              v-for="{ text, value } in sortingDays"
              :key="text"
              :value="value"
              :text="text"
            >
              {{ text }}
            </VuePickerOption>
          </div>
        </template>
      </VuePicker>
    </div>
    <transition name="fade" mode="out-in">
      <template v-if="!isLoading">
        <div class="content">
          <div class="test">
            <LineChartD3 :chart="tempDate"></LineChartD3>
          </div>
        </div>
      </template>
      <span class="empty" v-else>
        <span id="loading" class="empty-loading"></span>
        Wait data preparation
      </span>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { handleError } from '@/helpers/errors'
import BackButton from '@/components/BackButton.vue'
import LineChartD3 from '@/components/Charts/LineChartd3.vue'
import { callers } from '@/api/callers'

export default defineComponent({
  name: 'DailyTransactionsVolumeChart',
  components: { LineChartD3, BackButton },
  setup: function () {
    const tempDate = ref([
      { date: new Date('October 1, 2021 00:00:00'), value: 4 },
      { date: new Date('October 2, 2021 00:00:00'), value: 2 },
      { date: new Date('October 3, 2021 00:00:00'), value: 5 },
      { date: new Date('October 4, 2021 00:00:00'), value: 11 },
      { date: new Date('October 5, 2021 00:00:00'), value: 22 },
    ])

    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const isLoading = ref<boolean>(false)
    const sortingValue = ref<string>('1')
    const sortingDays: Array<{ text: string; value: string }> = [
      {
        text: 'Last 24 hours',
        value: '1',
      },
      {
        text: 'Last 7 days',
        value: '7',
      },
      {
        text: 'Last 14 days',
        value: '14',
      },
    ]

    const getDataByDays = async (days: number): Promise<void> => {
      // Todo: Wait for back-end

      console.debug('getDataByDays', days)

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 2)

      isLoading.value = true
      try {
        console.log(await callers.getTxVolumePerDays(startDate, endDate))
        console.log(await callers.getTxVolume({ startDate, endDate }))

        isLoading.value = false
      } catch (error) {
        handleError(error)
        console.error(error)
      }
    }

    // TODO: temp change date
    watch(
      sortingValue,
      // async (): Promise<void> => await getChartData(Number(sortingValue.value))
      (): void => console.debug('sortingValue', Number(sortingValue.value))
    )

    const getChartData = async (_sortingValue: number): Promise<void> => {
      await getDataByDays(_sortingValue)
    }

    onMounted(async (): Promise<void> => {
      await getChartData(Number(sortingValue.value))
    })

    return {
      router,
      route,
      tempDate,
      sortingDays,
      sortingValue,
      isLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
#line {
  height: 45.9rem;
}

.empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.sort-wrapper {
  margin-top: 3.2rem;
  justify-content: space-between;
  span {
    font-weight: 300;
    font-size: 1.4rem;
    line-height: 2rem;
  }
}

.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    repeat(4, minmax(4rem, 1fr));

  @media screen and (max-width: 99.2rem) {
    grid: repeat(4, minmax(4rem, 1fr)) / auto;
  }
}
.data-sources__table-head {
  @media (max-width: 48rem) {
    display: none;
  }
}

.app-table__cell-txt {
  max-width: 150px;
}

.app-table__header {
  display: none;
  @media screen and (max-width: 99.2rem) {
    display: inline-block;
    width: 20rem;
  }
}

.title {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.chart-block {
  display: flex;
  height: 39.1rem;
  width: 100%;
  position: relative;
  margin: 10.3rem 0 7.5rem 0;
  @media (max-width: 48rem) {
    margin: 3.2rem 0 4.2rem;
  }
  &__wrapper {
    width: 100%;
    height: 100%;
  }
  &__total {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #212529;
    text-align: center;
    h3 {
      font-weight: 600;
      font-size: 2.4rem;
      line-height: 2.9rem;
    }
    span {
      margin-top: 0.4rem;
      font-size: 1.6rem;
      line-height: 2.4rem;
      font-weight: 600;
    }
  }
}
</style>
