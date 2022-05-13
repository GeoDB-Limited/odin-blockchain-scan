<template>
  <div class="app__main-view blocks-item">
    <div class="app__main-view-title-wrapper">
      <BackButton text="Blocks" />
      <h2 class="app__main-view-title blocks-item__title">Block</h2>
      <span class="app__main-view-subtitle">{{ blockHeight }}</span>
    </div>

    <div class="blocks-item__table">
      <div class="blocks-item__table-row">
        <div class="blocks-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="blocks-item__table-row-tooltip">
            {{ TOOLTIP_INFO.blockHeight }}
          </span>
        </div>
        <span class="blocks-item__table-row-title">Block height</span>
        <span class="blocks-item__table-row-value">{{ blockHeight }}</span>
        <CopyButton class="mg-l8" :text="String(blockHeight)" />
      </div>
      <div class="blocks-item__table-row">
        <div class="blocks-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="blocks-item__table-row-tooltip">
            {{ TOOLTIP_INFO.blockHash }}
          </span>
        </div>
        <span class="blocks-item__table-row-title">Block hash</span>
        <span class="blocks-item__table-row-value">{{ blockHash }}</span>
        <CopyButton class="mg-l8" :text="String(blockHash)" />
      </div>
      <div class="blocks-item__table-row">
        <div class="blocks-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="blocks-item__table-row-tooltip">
            {{ TOOLTIP_INFO.blockParentHash }}
          </span>
        </div>
        <span class="blocks-item__table-row-title">Block parent hash</span>
        <span class="blocks-item__table-row-value">
          {{ blockParentHash }}
        </span>
        <CopyButton class="mg-l8" :text="String(blockParentHash)" />
      </div>
      <div class="blocks-item__table-row">
        <div class="blocks-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="blocks-item__table-row-tooltip">
            {{ TOOLTIP_INFO.timestamp }}
          </span>
        </div>
        <span class="blocks-item__table-row-title">Timestamp</span>
        <span class="blocks-item__table-row-value">{{ blockTimestamp }}</span>
      </div>
      <div class="blocks-item__table-row">
        <div class="blocks-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="blocks-item__table-row-tooltip">
            {{ TOOLTIP_INFO.blocksTransactions }}
          </span>
        </div>
        <span class="blocks-item__table-row-title">Block`s transactions</span>
        <div class="blocks-item__table-row-values">
          <template v-if="blocksTransactions?.length">
            <TitledLink
              v-for="item in blocksTransactions"
              :key="item.hash"
              :to="`/transactions/${item.hash}`"
              class="blocks-item__table-row-value blocks-item__table-row-link"
              :text="item.hash"
            />
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </div>
      </div>
      <div class="blocks-item__table-row">
        <div class="blocks-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="blocks-item__table-row-tooltip">
            {{ TOOLTIP_INFO.blockCreator }}
          </span>
        </div>
        <span class="blocks-item__table-row-title">Block creator</span>
        <TitledLink
          :to="`/validators/${blockCreator}`"
          class="blocks-item__table-row-value blocks-item__table-row-link"
          :text="blockCreator"
        />
        <CopyButton class="mg-l8" :text="String(blockCreator)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'
import { toHex } from '@cosmjs/encoding'
import { formatDate } from '@/helpers/formatters'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import TitledLink from '@/components/TitledLink.vue'
// import { prepareTransaction } from '@/helpers/helpers'

const TOOLTIP_INFO = {
  blockHeight: `Also known as Block Number. The block height,
    which indicates length of the blockchain, increases after 
    the addition of the new the new block.`,
  blockHash: 'The hash of the block header of the current block.',
  blockParentHash:
    'The hash of the block from which this block was generated, also known as its parent block.',
  timestamp: 'The date and time at which a block is validated.',
  blocksTransactions: 'List of transactions in the block.',
  blockCreator:
    'Validator who successfully included the block onto the blockchain.',
  blockSize: 'The block size is actually determined by the block`s gas limit.',
}

export default defineComponent({
  components: { BackButton, CopyButton, TitledLink },
  setup() {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const blockInfo = ref()
    const blockHeight = ref(route.params.id)
    const blockHash = ref('-')
    const blockParentHash = ref('-')
    const blockTimestamp = ref()
    const blocksTransactions = ref()
    const blockCreator = ref('-')

    const getBlock = async () => {
      try {
        blockInfo.value = await callers.getBlock(Number(route.params.id))
        blockHash.value = '0x' + toHex(blockInfo.value.blockId.hash)
        blockParentHash.value =
          '0x' + toHex(blockInfo.value.block.header.lastBlockId.hash)
        blockTimestamp.value = formatDate(blockInfo.value.block.header.time)

        const validatorData = await callers.getValidatorByConsensusKey(
          toHex(blockInfo.value.block.header.proposerAddress)
        )

        blockCreator.value = validatorData.data.result.result.operator_address

        // const { txs } = await callers.getTxSearch({
        //   query: `tx.height = ${Number(route.params.id)}`,
        // })
        // blocksTransactions.value = await prepareTransaction(txs)
      } catch (error) {
        handleError(error as Error)
      }
    }

    onMounted(async () => {
      await getBlock()
    })

    return {
      TOOLTIP_INFO,
      blockInfo,
      blockHeight,
      blockHash,
      blockParentHash,
      blockTimestamp,
      blocksTransactions,
      blockCreator,
    }
  },
})
</script>

<style lang="scss" scoped>
.blocks-item {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__table-row {
    display: flex;
    align-items: flex-start;
    padding: 1.6rem 0;
    border-bottom: 0.1rem solid var(--clr__input-border);
  }

  &__table-row-info {
    display: flex;
    align-items: center;
    height: 2.3rem;
    position: relative;
    cursor: pointer;
    margin-right: 0.9rem;

    &:hover {
      .blocks-item__table-row-tooltip {
        display: block;
      }
    }
  }

  &__table-row-tooltip {
    display: none;
    position: absolute;
    bottom: 130%;
    left: -50%;
    min-width: 30rem;
    padding: 1.2rem 2.4rem;
    background: var(--clr__tooltip-bg);
    border-radius: 0.8rem;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 1.6rem;
    color: var(--clr__tooltip-text);

    &:before {
      content: '';
      display: block;
      width: 0.6rem;
      height: 0.6rem;
      position: absolute;
      bottom: -0.3rem;
      left: 1.6rem;
      transform: translateX(-50%) rotate(45deg);
      background: var(--clr__tooltip-bg);
    }
  }

  &__table-row-title {
    min-width: 14.5rem;
    line-height: 2.3rem;
    margin-right: 2.4rem;
  }

  &__table-row-value {
    font-size: 1.4rem;
    @include ellipsis();
  }

  &__table-row-values {
    display: flex;
    flex-direction: column;
    @include ellipsis();

    & > *:not(:last-child) {
      margin-bottom: 0.8rem;
    }
  }

  &__table-row-link {
    text-decoration: none;
    color: var(--clr__action);
  }
}

@include respond-to(tablet) {
  .blocks-item {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }

    &__table-row-info {
      display: none;
    }
  }
}
</style>
