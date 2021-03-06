<template>
  <div class="blocks-container">
    <div class="data-sources view-main">
      <div class="view-main__title-wrapper">
        <h2 class="view-main__title">Pending Transactions</h2>
      </div>
      <div class="mg-b16 mg-t16">
        <p>{{ totalTransactions }} pending transactions found</p>
      </div>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transaction hash </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Type </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Gas Limit </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Gas Price </span>
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
        <template v-if="filteredTransactions?.length">
          <PendingTransactionLine
            v-for="(item, index) in filteredTransactions"
            :key="index"
            :transition="item"
          />
          <AppPagination
            class="mg-t32"
            v-model="page"
            :pages="totalPages"
            @update:modelValue="updateHandler"
          />
        </template>
        <template v-else>
          <div class="app-table__row">
            <p class="app-table__empty-stub">No items yet</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import PendingTransactionLine from '@/components/PendingTransactionLine.vue'
import { defineComponent, ref, onMounted } from 'vue'
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { toHex } from '@cosmjs/encoding'
import { fromBase64 } from '@cosmjs/encoding'
import AppPagination from '@/components/AppPagination/AppPagination.vue'

export default defineComponent({
  name: 'PendingTransactions',
  components: { PendingTransactionLine, AppPagination },
  setup() {
    const transactions = ref()
    const filteredTransactions = ref()
    const transactionsPerPage = 5
    const currentPage = ref(1)
    const totalPages = ref()
    // const route = useRoute()
    const totalTransactions = ref()
    const toHexFunc = toHex

    // TODO: remove unused
    // let lastHeight = 0

    // const testPendingString = '"CpIBCo8BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm8KK29kaW4xbm5mZWd1cTMweDZud3hqaGF5cHh5bXgzbnVseXNwc3VqYTRhMngSK29kaW4xd3dwaHYzZ3IzMm5xZzZ3eTJlOGpnOWZ0NDVobXVhZ3NnNXpsYTkaEwoEbG9raRILMTAwMDAwMDAwMDASWApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAjJ9fZD9gps8fxP7cq+reyazHJn+Y6vdIU/zdObkb/i7EgQKAggBGAcSBBDAmgwaQGjtzoxsI2BbXOaRe6u7krV79u7qmOftaUWpzp+DBBLmegePGRT0UNKcamksVlmob8y/th4cGJhmuFn8kJkfNeE="'
    // const testPendingTrans = [
    // {
    //   authInfo: {
    //     fee: {
    //       amount: [],
    //       gasLimit: {
    //         high: 0,
    //         low: 200000,
    //         unsigned: true,
    //       },
    //       granter: "",
    //       payer: ""
    //     },
    //     signerInfos: [
    //       {
    //         modeInfo: {
    //           mode: 1
    //         },
    //         publicKey: {
    //           typeUrl: '/cosmos.crypto.secp256k1.PubKey',
    //           value: []
    //         },
    //         sequence : {
    //           high: 0,
    //           low: 7,
    //           unsigned: true,
    //         }
    //       }
    //     ]
    //   },
    //   body : {
    //     extensionOptions: [],
    //     memo: '',
    //     messages: [
    //       {
    //         typeUrl: "/cosmos.bank.v1beta1.MsgSend"
    //       }
    //     ],
    //     nonCriticalExtensionOptions: [],
    //     timeoutHeight: {
    //       high: 0,
    //       low: 0,
    //       unsigned: true,
    //     }
    //   },
    //   signatures: [
    //     {

    //     }
    //   ]

    // ]

    const getTransactions = async () => {
      // const client = await callers.getClient()

      // if (!route.params.height) {
      //   await client.abciInfo().then((res) => {
      //     if (res && res.lastBlockHeight) {
      //       lastHeight = +res.lastBlockHeight
      //     }
      //   })
      // } else {
      //   lastHeight = +route.params.height
      // }

      await callers
        .getPendingTransactions(10000000)
        .then((res) => res.json())
        .then((data) => {
          const codedStrings = data.result.txs
          const tempStrings: Tx[] = []

          codedStrings.forEach((str: string): void => {
            const decodedTx = Tx.decode(fromBase64(str))
            tempStrings.push(decodedTx)
          })

          transactions.value = [...tempStrings]
          totalTransactions.value = tempStrings.length

          totalPages.value = Math.ceil(tempStrings.length / transactionsPerPage)
        })
        .then((): void => filterTransactions(currentPage.value))
    }

    const filterTransactions = (newPage: number): void => {
      let tempArr = transactions.value

      if (newPage === 1) {
        filteredTransactions.value = tempArr.slice(
          0,
          newPage * transactionsPerPage
        )
      } else {
        filteredTransactions.value = tempArr.slice(
          (newPage - 1) * transactionsPerPage,
          (newPage - 1) * transactionsPerPage + transactionsPerPage
        )
      }
      currentPage.value = newPage
    }

    const updateHandler = (num: number): void => {
      filterTransactions(num)
    }

    onMounted(() => {
      getTransactions()
    })

    return {
      transactions,
      currentPage,
      totalPages,
      totalTransactions,
      filteredTransactions,
      filterTransactions,
      updateHandler,
      toHexFunc,
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

.app-table__head {
  @media screen and (max-width: 992px) {
    display: none;
  }
}

.app-table__header {
  display: none;

  @media screen and (max-width: 768px) {
    display: inline-block;
    width: 20rem;
  }
}
</style>
