<template>
  <div class="container">
    <div class="mg-b16 mg-t32">
      <h2 class="view-title" title="some blocks">Top accounts</h2>
    </div>
    <div class="mg-b16 mg-t16 accounts-header__wrapper">
      <p v-if="accounts?.length">{{ accounts?.length }} accounts found</p>
      <p v-else></p>
      <div class="sort-wrapper">
        <span>Sort By</span>
        <VuePicker
          class="app-form__field-input app-filter app-filter--coin"
          name="filter"
          v-on:update:modelValue="sortAccounts"
          v-model="sortingValue"
        >
          <template #dropdownInner>
            <div class="app-filter__dropdown-inner">
              <VuePickerOption
                v-for="{ text, value } in sortingOptions"
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
    </div>
    <template v-if="filteredAccounts?.length">
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell" data-tooltip="">
            <span class="app-table__cell-txt"> Rank </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Address </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> GEO balance </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> GEO token percentage </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> ODIN balance </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> ODIN token percentage </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transaction count </span>
          </div>
        </div>
        <AccountsLine
          v-for="(item, index) in filteredAccounts"
          :key="index"
          :account="item"
          :totalOdin="totalOdin"
          :totalGeo="totalGeo"
          :rank="(+currentPage - 1) * +ITEMS_PER_PAGE + (index + 1)"
        />
      </div>
      <div class="pagination-wrapper mg-t32">
        <v-pagination
          v-model="currentPage"
          :pages="totalPages"
          :range-size="1"
          active-color="#007bff"
          @update:modelValue="filterAccounts"
          :hideFirstButton="true"
          :hideLastButton="true"
        >
        </v-pagination>
      </div>
    </template>
    <template v-else>
      <div class="empty">Waiting to receive data</div>
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import AccountsLine from '@/components/AccountsLine.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

import { Pagination } from '@/api/query-ext/telemetryExtension.ts'
import { Coin } from '@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin'
import { TempBalanceType } from '@/helpers/Types'
import { getTopAccountList } from '@/helpers/Accounts'

export default defineComponent({
  components: { VPagination, AccountsLine },
  setup() {
    const ITEMS_PER_PAGE = 5
    const pagination: Pagination = new Pagination([], 0, 100, true, true)

    const accounts = ref<Array<TempBalanceType>>()
    const filteredAccounts = ref<Array<TempBalanceType>>()
    const currentPage = ref<number>(1)
    const totalPages = ref<number>()
    const sortingValue = ref<string>('odin')
    const totalOdin = ref<number>(0)
    const totalGeo = ref<number>(0)
    const totalCurrency = ref<Array<Coin> | null>(null)
    const sortingOptions = ref([
      { text: 'Geo balance', value: 'geo' },
      { text: 'ODIN balance', value: 'odin' },
    ])
    const getAccounts = async (): Promise<void> => {
      totalCurrency.value =
        (await callers.getUnverifiedTotalSupply()) as Array<Coin>
      totalOdin.value = Number(
        totalCurrency.value.find((el) => el.denom === 'loki')?.amount
      )
      totalGeo.value = Number(
        totalCurrency.value.find((el) => el.denom === 'minigeo')?.amount
      )
      accounts.value = await getTopAccountList(pagination)
      for (const a of accounts.value) {
        const { txs } = await callers.getTxSearch({
          query: `message.sender='${a.address}'`,
        })
        a.total_tx = txs.length
      }
      totalPages.value = Math.ceil(accounts.value.length / ITEMS_PER_PAGE)
      sortingValue.value = 'geo'
      try {
        await sortAccounts()
        await filterAccounts(currentPage.value)
      } catch (err) {
        console.error(err)
      }
    }

    const filterAccounts = async (newPage: number): Promise<void> => {
      let tempArr = accounts.value

      if (newPage === 1) {
        filteredAccounts.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredAccounts.value = tempArr?.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }

      currentPage.value = newPage
    }

    const sortAccounts = async (): Promise<void> => {
      filteredAccounts.value = []
      let tempAcc: Array<TempBalanceType> = []

      if (sortingValue.value === 'geo') {
        tempAcc = accounts.value?.sort(
          (a: TempBalanceType, b: TempBalanceType) =>
            b.geoBalance - a.geoBalance
        ) as Array<TempBalanceType>
      } else if (sortingValue.value === 'odin') {
        tempAcc = accounts.value?.sort(
          (a: TempBalanceType, b: TempBalanceType) =>
            b.odinBalance - a.odinBalance
        ) as Array<TempBalanceType>
      }

      accounts.value = tempAcc
      await filterAccounts(1)
    }

    onMounted(async (): Promise<void> => {
      await getAccounts()
    })

    return {
      accounts,
      currentPage,
      totalPages,
      filteredAccounts,
      filterAccounts,
      sortAccounts,
      sortingValue,
      sortingOptions,
      totalGeo,
      totalOdin,
      ITEMS_PER_PAGE,
    }
  },
})
</script>

<style scoped lang="scss">
.data-sources__table-head,
.data-sources__table-row {
  grid: auto/50px repeat(6, 1fr);
  @media screen and (max-width: 992px) {
    grid: 60px repeat(6, minmax(4rem, 1fr)) / auto;
  }
}

.blocks-container {
  border-top: 1px solid var(--clr__table-border);
}

.app-table__row {
  padding: 3.2rem 0 2rem;

  @media screen and (max-width: 992px) {
    padding: 1.6rem 0 0 0;
  }
}

.app-table__cell {
  position: relative;
}

.app-table__cell-txt {
  max-width: 200px;

  @media screen and (max-width: 600px) {
    max-width: 150px;
  }
}

.view-title {
  font-weight: 400;
  font-size: 32px;

  @media screen and (max-width: 600px) {
    font-size: 28px;
  }
}

.app-table__cell-txt:hover + .tooltip {
  opacity: 1;
}

.tooltip {
  opacity: 0;
  position: absolute;
  left: 0;
  bottom: 100%;
  transform: translateY(-50%);
  transition: all 0.15s ease;
  border-radius: 10px;
  white-space: nowrap;
  background: var(--clr__tooltip-new);
  padding: 12px 24px;
  color: #fff;
  z-index: 1;
  pointer-events: none;

  &:before {
    content: '';
    border-top: 10px solid var(--clr__tooltip-new);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    position: absolute;
    left: 20px;
    top: 100%;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.currency {
  text-transform: uppercase;
}

.app-table__head {
  @media screen and (max-width: 992px) {
    display: none;
  }
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 170px;
  }
}

.accounts {
  &-header {
    &__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @media screen and (max-width: 600px) {
        flex-direction: column;

        & > p {
          margin-bottom: 3.2rem;
        }
      }
    }
  }
}

.sort {
  &-select {
    border: none;
    margin-left: 16px;
    min-width: 150px;
    width: 100%;

    &:focus {
      border: none;
      outline: none;
    }

    option:checked {
      background-color: var(--clr__action);
    }

    @media screen and (max-width: 600px) {
      margin-left: 0;
    }
  }

  &-wrapper {
    display: flex;
    align-items: center;
    span {
      white-space: nowrap;
    }

    @media (max-width: 480px) {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 1px solid var(--clr__action);
    border-radius: 4px;
    margin: 0 4px;
    min-width: 26px;
    height: 36px;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 10px;
  }

  .Page {
    color: var(--clr__action);

    &:hover {
      border: none;
    }
  }
  .Page-active {
    color: #fff;
  }

  .PaginationControl .Control.Control-active {
    fill: var(--clr__action);
  }
  .PaginationControl .Control {
    fill: #cce4ff;
  }

  .DotsHolder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    svg,
    path {
      color: var(--clr__action);
    }
  }
}
</style>
