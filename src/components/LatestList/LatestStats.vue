<template>
  <transition name="fade" mode="out-in" appear>
    <div class="latest">
      <div class="latest__wrapper">
        <LatestList :header="latestBlocksHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestBlocks">
              <LatestListItem
                v-for="item in latestBlocks"
                :key="item.blockId.hash"
              >
                <template #label> Bk </template>
                <template #name>
                  <TitledLink
                    :to="`/blocks/${item.header.height}`"
                    class="app-table__cell-txt"
                    :text="item.header.height"
                  />
                </template>
                <template #time>
                  <div class="info-value">
                    {{ diffDays(toDay, getDay(item.header.time)) }}
                  </div>
                </template>
                <template #validator>
                  <span>Validator:</span>
                  <TitledLink
                    :to="`/validators/${item.validator}`"
                    class="app-table__cell-txt app-table__link"
                    :text="`${cropText(item.validator)}`"
                  />
                </template>
                <template #transactions>
                  <span>{{ item.txs }} transactions</span>
                </template>
              </LatestListItem>
            </template>
            <div class="latest-list-item" v-else>
              <span class="latest-list-item__empty"> no item </span>
            </div>
          </transition-group>
        </LatestList>
        <LatestList :header="latestTransactionsHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestTransactions.length">
              <LatestListItem
                v-for="item in latestTransactions"
                :key="item.hash"
              >
                <template #label> Tx </template>
                <template #name>
                  <TitledLink
                    v-if="item.hash"
                    class="app-table__cell-txt"
                    :to="`/transactions/${item.hash}`"
                    :text="cropText(`0x${item.hash}`)"
                  />
                  <span v-else>No info</span>
                </template>
                <template #time>
                  {{ diffDays(toDay, getDay(item.time)) }}
                </template>
                <template #from>
                  <span>From:</span>
                  <TitledLink
                    v-if="item.sender"
                    :to="`/account/${item.sender}`"
                    class="app-table__cell-txt app-table__link"
                    :text="cropText(item.sender)"
                  />
                  <span v-else>No info</span>
                </template>
                <template #to>
                  <span>To:</span>
                  <TitledLink
                    v-if="item.receiver"
                    class="app-table__cell-txt app-table__link"
                    :to="`/account/${item.receiver}`"
                    :text="cropText(item.receiver)"
                  />
                  <span v-else>No info</span>
                </template>
              </LatestListItem>
            </template>
            <div class="latest-list-item" v-else>
              <span class="latest-list-item__empty"> no item </span>
            </div>
          </transition-group>
        </LatestList>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { diffDays, cropText, getDay } from '@/helpers/formatters'

import LatestList from '@/components/LatestList/LatestList.vue'
import LatestListItem from '@/components/LatestList/LatestListItem.vue'
import TitledLink from '@/components/TitledLink.vue'
import { toHexFunc } from '@/helpers/helpers'
import { adjustedData, TransformedBlocks } from '@/helpers/Types'
import { handleError } from '@/helpers/errors'
import { prepareBlocks } from '@/helpers/blocksHelper'

export default defineComponent({
  name: 'LatestStats',
  components: { LatestList, LatestListItem, TitledLink },
  setup: function () {
    const toDay = ref<Date>(new Date())

    onMounted(async (): Promise<void> => {
      try {
        await getLatestBlocks()
        // await getLatestTransactions()
      } catch (error) {
        handleError(error as Error)
      }
    })

    let latestBlocks = ref<Array<TransformedBlocks> | null>([])

    let latestTransactions = ref<Array<adjustedData> | null>([])
    let lastHeight = ref<number>(0)
    // let totalCount = ref<number>()

    const getLatestBlocks = async (): Promise<void> => {
      const { blockMetas, lastHeight: reqLastHeight } =
        await callers.getBlockchain()
      latestBlocks.value = await prepareBlocks(blockMetas.slice(0, 5))
      lastHeight.value = reqLastHeight
    }
    // const getLatestTransactions = async (): Promise<void> => {
    //   const { totalCount: reqTotalCount, txs } = await callers.getTxSearch({
    //     query: `tx.height >= 0`,
    //     per_page: 5,
    //     order_by: 'desc',
    //   })

    //   if (txs) {
    //     latestTransactions.value = await prepareTransaction(txs)
    //   }

    //   console.debug('latestTransactions', latestTransactions.value)
    //   totalCount.value = reqTotalCount
    // }

    let latestBlocksHeader = {
      title: 'Latest Blocks',
      link: 'View all Blocks',
      linkDataText: 'Blocks',
    }
    let latestTransactionsHeader = {
      title: 'Latest Transactions',
      link: 'View all Transactions',
      linkDataText: 'Transactions',
    }

    return {
      latestBlocksHeader,
      latestBlocks,
      latestTransactions,
      latestTransactionsHeader,
      diffDays,
      cropText,
      toHexFunc,
      toDay,
      getDay,
    }
  },
})
</script>

<style lang="scss" scoped>
.latest {
  &-list-item {
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
    }
  }
  &__wrapper {
    display: grid;
    align-items: flex-start;
    gap: 2.4rem;
    grid-template-columns: 1fr 1fr;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
