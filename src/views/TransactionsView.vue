<template>
  <div class="app__main-view">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Transactions</h2>
    </div>
    <div class="mg-b16 mg-t16" v-if="transactions?.length">
      <p>{{ totalTransactions }} transactions found</p>
    </div>
    <template v-if="transactions?.length">
      <div class="app-table">
        <div class="app-table__head">
          <span> Transaction hash </span>
          <span> Type </span>
          <span> Block </span>
          <span> Date and time </span>
          <span> Sender </span>
          <span> Receiver </span>
          <span> Amount </span>
          <span> Transaction Fee </span>
        </div>
        <TransitionLine
          v-for="(item, index) in transactions"
          :key="index"
          :transition="item"
        />
      </div>
      <AppPagination
        class="mg-t32"
        v-model="page"
        :pages="totalPages"
        @update:modelValue="updateHandler"
      />
    </template>
    <template v-else>
      <div class="empty">Waiting to receive data</div>
    </template>
  </div>
</template>

<script lang="ts">
// import { callers } from '@/api/callers'
import { defineComponent, ref, onMounted } from 'vue'
// import { handleError } from '@/helpers/errors'
// import { prepareTransaction } from '@/helpers/helpers'
import TransitionLine from '@/components/TransitionLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'

export default defineComponent({
  name: 'TransactionsView',
  components: { TransitionLine, AppPagination },
  setup() {
    // const ITEMS_PER_PAGE = 25
    const transactions = ref()
    const page = ref<number>(1)
    const totalPages = ref<number>()
    const totalTransactions = ref<number>()

    // const getTransactions = async () => {
    //   try {
    //     const { txs, totalCount } = await callers.getTxSearch({
    //       query: `tx.height >= 0`,
    //       page: page.value,
    //       per_page: ITEMS_PER_PAGE,
    //       order_by: 'desc',
    //     })

    //     transactions.value = await prepareTransaction(txs)
    //     totalTransactions.value = totalCount
    //     totalPages.value = Math.ceil(totalCount / ITEMS_PER_PAGE)
    //   } catch (error) {
    //     handleError(error as Error)
    //   }
    // }

    const updateHandler = async () => {
      // await getTransactions()
    }

    onMounted(async () => {
      // await getTransactions()
    })

    return {
      transactions,
      page,
      totalPages,
      totalTransactions,
      updateHandler,
    }
  },
})
</script>
