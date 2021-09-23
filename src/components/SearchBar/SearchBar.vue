<template>
  <div class="search">
    <div class="search__row">
      <VuePicker
        class="app-form__field-input app-filter app-filter--rounding-left"
        name="filter"
        v-model="activeFilter"
      >
        <template #dropdownInner>
          <div class="app-filter__dropdown-inner">
            <VuePickerOption
              v-for="(filter, index) in filters"
              :key="index"
              :value="filter"
              :text="filter"
            >
              {{ filter }}
            </VuePickerOption>
          </div>
        </template>
      </VuePicker>
      <div class="search__input-wrapper">
        <input
          type="search"
          class="filter-search"
          placeholder="searching by account address , block"
          v-model="searchedText"
        />

        <template v-if="searchResult">
          <div class="search__dropdown">
            <template v-for="result in searchResult">
              <template v-if="result.blocks">
                <BlockResultItem
                  v-for="block in result.blocks"
                  :result="block"
                  :key="block.block.header.height"
                />
              </template>
              <template v-if="result.transactions">
                <TransactionItem
                  v-for="transaction in result.transactions"
                  :result="transaction"
                  :key="transaction.height"
                />
              </template>
              <template v-if="result.accounts">
                <AccountItem
                  v-for="accounts in result.accounts"
                  :result="accounts"
                  :key="accounts"
                />
              </template>
            </template>
          </div>
        </template>
      </div>
      <button @click.prevent="searchBy" class="search-btn">
        <img src="~@/assets/icons/search.svg" alt="search" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import {
  BlockResponse,
  TxResponse,
} from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { Router, useRouter } from 'vue-router'
import BlockResultItem from '@/components/SearchBar/BlockResultItem.vue'
import TransactionItem from '@/components/SearchBar/TransactionItem.vue'
import AccountItem from '@/components/SearchBar/AccountItem.vue'
import {SearchResultType, TempSearchAccountInfoType} from '@/helpers/Types'
import {
  makeTransactionListFormatted,
  TransactionListFormatted,
} from '@/helpers/makeTransactionListFormatted'
import { handleError } from '@/helpers/errors'

export default defineComponent({
  name: 'SearchBar',
  components: { BlockResultItem, TransactionItem, AccountItem },
  setup() {
    const filters = ref<Array<string>>([
      'All filters',
      'Blocks',
      'Transaction',
      'Account Address',
    ])

    const activeFilter = ref<string>(filters.value[0])
    const searchedText = ref<string | null>('')
    const searchResult = ref<Array<SearchResultType> | null>(null)

    watch(activeFilter, () => {
      searchResult.value = null
    })

    const getTransactions = async (): Promise<
      Array<TransactionListFormatted>
    > => {
      try {
        const { txs } = await callers.getTxSearch({
          query: `tx.height = ${Number(searchedText.value)}`,
        })
        return (await makeTransactionListFormatted([
          ...txs,
        ] as Array<TxResponse>)) as Array<TransactionListFormatted>
      } catch {
        return []
      }
    }

    const getAccount = async (): Promise<Array<TempSearchAccountInfoType>> => {
      try {
        const geoBalance = await callers.getUnverifiedBalances(
          searchedText.value as string,
          'minigeo'
        )
        const odinBalance = await callers.getUnverifiedBalances(
          searchedText.value as string,
          'loki'
        )
        return [
          {
            address: searchedText.value as string,
            geoBalance: { ...geoBalance },
            odinBalance: { ...odinBalance },
          },
        ]
      } catch {
        return []
      }
    }

    const getBlock = async (): Promise<Array<BlockResponse>> => {
      try {
        return [
          (await callers.getBlock(Number(searchedText.value))) as BlockResponse,
        ]
      } catch {
        return []
      }
    }

    const searchBy = async (): Promise<Array<SearchResultType> | null> => {
      if (searchedText.value === '') return (searchResult.value = null)
      try {
        if (activeFilter.value === 'Blocks') {
          return (searchResult.value = [
            {
              blocks: await getBlock(),
            },
          ])
        }
        if (activeFilter.value === 'Transaction') {
          return (searchResult.value = [
            {
              transactions: await getTransactions(),
            },
          ])
        }
        if (activeFilter.value === 'Account Address') {
          return [
            {
              accounts: await getAccount(),
            },
          ]
        }
        return (searchResult.value = [
          {
            blocks: await getBlock(),
            transactions: await getTransactions(),
            accounts: await getAccount(),
          },
        ])
      } catch (e) {
        console.error(e.message)
        handleError(e)
        searchResult.value = null
      }
      return null
    }

    const router: Router = useRouter()
    router.beforeEach(() => {
      searchResult.value = null
    })

    return {
      filters,
      activeFilter,
      searchedText,
      searchBy,
      searchResult,
      diffDays,
      cropText,
      getDay,
    }
  },
})
</script>
<style lang="scss" scoped>
.search {
  margin: 0 10.3rem 2.5rem 10.3rem;
  &__input-wrapper {
    width: 39.6rem;
    position: relative;
    @media (max-width: 480px) {
      position: inherit;
    }
  }
  &__dropdown {
    position: absolute;
    background: white;
    border: 0.1rem solid var(--clr__input-border);
    border-radius: 0 0 0.8rem 0.8rem;
    width: 100%;
    z-index: 2;
  }
  &__row {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    @media screen and (max-width: 600px) {
      padding: 0 1.6rem;
    }
  }
  @media (max-width: 768px) {
    margin: 0;
    padding: 0 1rem 2.5rem 1rem;
    &__row {
      padding: 0;
    }
  }
}

.filter-search {
  height: 4.8rem;
  padding: 1.2rem 1.5rem;
  width: 100%;
  max-width: 42.6rem;
  border: 0.1rem solid var(--clr__input-border);
  border-left: none;
  border-right: none;
  &::placeholder {
    color: var(--clr__text-muted);
  }
}
.search-btn {
  width: 48px;
  height: 48px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background: var(--clr__action);
  border-top-right-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;

  img {
    width: 1.8rem;
    height: 1.8rem;
    display: block;
  }
}
</style>
