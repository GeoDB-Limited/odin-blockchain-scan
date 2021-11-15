<template>
  <div class="container">
    <div class="mg-b16 mg-t32">
      <h2 class="view-title">Transactions</h2>
    </div>
    <div class="mg-b16 mg-t16" v-if="filteredTransactions?.length">
      <p>{{ totalTransactions }} transactions found</p>
    </div>
    <template v-if="filteredTransactions?.length">
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transaction hash </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Type </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Block </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Date and time </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Sender </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Receiver </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Amount </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transaction Fee </span>
          </div>
        </div>
        <TransitionLine
          v-for="(item, index) in filteredTransactions"
          :key="index"
          :transition="item"
        />
      </div>
      <div class="pagination-wrapper mg-t32">
        <v-pagination
          v-model="page"
          :pages="totalPages"
          :range-size="1"
          active-color="#007bff"
          @update:modelValue="updateHandler"
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
import TransitionLine from '@/components/TransitionLine.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { handleError } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'

export default defineComponent({
  name: 'Transactions',
  components: { VPagination, TransitionLine },
  setup() {
    const ITEMS_PER_PAGE = 5
    const transactions = ref()
    const filteredTransactions = ref()
    const page = ref<number>(1)
    const totalPages = ref<number>()
    const totalTransactions = ref<number>()
    let lastHeight = 500

    const getTransactions = async () => {
      try {
        const { txs } = await callers.getTxSearch({
          query: `tx.height >= ${lastHeight - 10}`,
        })

        transactions.value = await prepareTransaction(txs)

        totalTransactions.value = transactions.value.length
        totalPages.value = Math.ceil(transactions.value.length / ITEMS_PER_PAGE)

        await filterTransactions(page.value)
      } catch (e) {
        console.error(e.message)
        handleError(e)
      }
    }

    const filterTransactions = async (newPage: number): Promise<void> => {
      let tempArr = transactions.value
      if (newPage === 1) {
        filteredTransactions.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredTransactions.value = tempArr?.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }

      console.debug('filteredTransactions.value', filteredTransactions.value)
      page.value = newPage
    }

    const updateHandler = (num: number) => {
      filterTransactions(num)
    }

    onMounted(() => {
      getTransactions()
    })

    return {
      transactions,
      page,
      totalPages,
      totalTransactions,
      filteredTransactions,
      filterTransactions,
      updateHandler,
    }
  },
})
</script>

<style scoped lang="scss">
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    repeat(8, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(8, minmax(4rem, 1fr)) / auto;
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

.app-table__cell-txt {
  max-width: 150px;
  padding-right: 10px;
}

.view-title {
  font-weight: 400;
  font-size: 3.2rem;

  @media screen and (max-width: 600px) {
    font-size: 2.8rem;
  }
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
    width: 20rem;
  }
}
</style>
<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.4rem;
    margin: 0 0.4rem;
    min-width: 2.6rem;
    height: 3.6rem;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 1rem;
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
