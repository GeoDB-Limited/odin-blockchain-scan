<template>
  <div class="app__main-view top-accounts">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Top accounts</h2>
    </div>
    <div class="top-accounts__sort-wrapper">
      <p class="top-accounts__sort-info" v-if="accounts?.length">
        {{ accounts.length }} accounts found
      </p>
      <div class="top-accounts__sort-field">
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
        <div class="app-table__head">
          <span> Rank </span>
          <span> Address </span>
          <span> GEO balance </span>
          <span> GEO token percentage </span>
          <span> ODIN balance </span>
          <span> ODIN token percentage </span>
          <span> Transaction count </span>
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
      <AppPagination
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="filterAccounts"
      />
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
import { Pagination } from '@/api/query-ext/telemetryExtension'
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { TempBalanceType } from '@/helpers/Types'
import { getTopAccountList } from '@/helpers/Accounts'

import AppPagination from '@/components/AppPagination/AppPagination.vue'

export default defineComponent({
  name: 'top-accounts',
  components: { AppPagination, AccountsLine },
  setup() {
    const ITEMS_PER_PAGE = 5
    const pagination: Pagination = new Pagination(0, 100, true, true)

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
        // const { txs } = await callers.getTxSearch({
        //   query: `message.sender='${a.address}'`,
        // })
        a.total_tx = 0
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
.top-accounts {
  &__sort-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3.2rem;
  }

  &__sort-field {
    display: flex;
    align-items: center;
  }
}

@include respond-to(small) {
  .top-accounts {
    &__sort-wrapper {
      flex-direction: column;
      align-items: flex-start;

      & > p {
        margin-bottom: 3.2rem;
      }
    }
  }
}
</style>
