<template>
  <transition name="fade" mode="out-in" appear>
    <div class="latest">
      <div class="latest__wrapper">
        <LatestList :header="latestBlocksHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestBlocks.length">
              <LatestListItem
                v-for="item in latestBlocks"
                :key="item.blockId.hash"
              >
                <template #label> Bk </template>
                <template #name>
                  <TitledLink
                    :link="`/blocks/${item.header.height}`"
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
                    :link="`/validators/${item.header.height}`"
                    class="app-table__cell-txt"
                    :text="`${cropText(
                      '0x' + toHexFunc(item.header.validatorsHash).toUpperCase()
                    )}`"
                  />
                </template>
                <template #transactions>
                  <span>{{ item.total_tx }} transactions</span>
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
                    class="app-table__cell-txt"
                    :link="`/transactions/${item.block}/${item.hash}`"
                    :text="item.hash ? cropText(`0x${item.hash}`) : 'No info'"
                  />
                </template>
                <template #time>
                  {{ diffDays(toDay, getDay(item.time)) }}
                </template>
                <template #from>
                  <span>From:</span>
                  <router-link :to="`/account/${item.sender}`">
                    <TitledLink
                      class="app-table__cell-txt"
                      :text="
                        item.sender ? cropText(`0x${item.sender}`) : 'No info'
                      "
                    />
                  </router-link>
                </template>
                <template #to>
                  <span> To: </span>
                  <router-link :to="`/account/${item.receiver}`">
                    <TitledLink
                      class="app-table__cell-txt"
                      :text="
                        item.receiver
                          ? cropText(`0x${item.receiver}`)
                          : 'No info'
                      "
                    />
                  </router-link>
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
import { prepareTransaction, toHexFunc } from '@/helpers/helpers'
import { adjustedData, latestBlocksInterface } from '@/helpers/Types'
import { handleError } from '@/helpers/errors'

export default defineComponent({
  name: 'Latest',
  components: { LatestList, LatestListItem, TitledLink },
  setup: function () {
    const toDay = ref<Date>(new Date())

    onMounted(async (): Promise<void> => {
      try {
        await getLatestBlocks()
        await getLatestTransactions()
      } catch (e) {
        console.error(e.message)
        handleError(e)
      }
    })

    let latestBlocks = ref<Array<latestBlocksInterface> | null>([])
    let latestTransactions = ref<Array<adjustedData> | null>([])
    let lastHeight = ref<number>(0)
    let totalCount = ref<number>()

    const getLatestBlocks = async (): Promise<void> => {
      const { blockMetas, lastHeight: reqLastHeight } =
        await callers.getBlockchain(100)
      let tempA: Array<latestBlocksInterface> = []
      for (let b of [...blockMetas].slice(0, 5)) {
        tempA = [
          ...tempA,
          {
            ...b,
            total_tx: await callers
              .getBlock(b?.header?.height)
              .then((res) => res?.block?.txs?.length),
          },
        ]
      }
      latestBlocks.value = tempA

      console.debug('latestBlocks.value', latestBlocks.value)

      lastHeight.value = reqLastHeight
    }
    const getLatestTransactions = async (): Promise<void> => {
      const { totalCount: reqTotalCount, txs } = await callers.getTxSearch({
        query: `tx.height >= ${lastHeight.value - 100000}`,
      })

      latestTransactions.value = await prepareTransaction(txs).then((pt) =>
        pt.slice(0, 5)
      )

      console.debug('latestTransactions', latestTransactions.value)
      totalCount.value = reqTotalCount
    }

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
