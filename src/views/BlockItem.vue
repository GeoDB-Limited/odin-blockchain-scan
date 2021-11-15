<template>
  <div class="container">
    <div class="block-item">
      <div class="block-item__title">
        <button class="block-back" @click.prevent="back">
          <img src="~@/assets/icons/back-arrow.svg" alt="info" />
        </button>
        <h1 class="block-name">Block</h1>
        <span class="block-id">{{ route.params.id }}</span>
      </div>
      <div class="block-chars">
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                Also known as Block Number. The block height, which indicates
                the length of the blockchain, increases after the addition of
                the new block.
              </span>
              Block height:
            </div>
          </div>
          <div class="info-value">
            <CopyText
              :text="String(route.params.id)"
              :title="String(route.params.id)"
              :displayText="String(route.params.id)"
            />
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The hash of the block header of the current block.
              </span>
              Block hash:
            </div>
          </div>
          <div class="info-value text-blue">
            <CopyText
              :text="`0x${blockHash}`"
              :title="`0x${blockHash}`"
              :displayText="`0x${blockHash}`"
            />
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The hash of the block from which this block was generated, also
                known as its parent block.
              </span>
              Block parent hash:
            </div>
          </div>
          <div class="info-value text-blue">
            <CopyText
              :text="`0x${blockParentHash}`"
              :title="`0x${blockParentHash}`"
              :displayText="`0x${blockParentHash}`"
            />
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The date and time at which a block is validated.
              </span>
              Timestamp:
            </div>
          </div>
          <div class="info-value">
            <span>{{
              formatDate(blockInfo?.block?.header.time, 'MMM d, yyyy, HH:mm')
            }}</span>
          </div>
        </div>
        <div
          class="data-sources__table-row app-table__row"
          v-if="blockSize?.value"
        >
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The number of transactions in the block.
              </span>
              Block’s transactions:
            </div>
          </div>
          <div class="info-value">
            <span>{{ blockSize?.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { callers } from '@/api/callers'
import { copyValue, getHash } from '@/helpers/helpers'
import { formatDate } from '@/helpers/formatters'
import { BlockResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import CopyText from '@/components/CopyText.vue'

export default defineComponent({
  name: 'BlockItem',
  components: { CopyText },
  setup() {
    const router: Router = useRouter()
    const back = (): void => {
      router.back()
    }
    const route: RouteLocationNormalizedLoaded = useRoute()

    const blockInfo = ref<BlockResponse>()
    // TODO: Why "blockSize" is needed ?
    const blockSize = ref()
    const blockHash = ref<string>()
    const blockParentHash = ref<string>()

    const getBlock = async (): Promise<void> => {
      blockInfo.value = await callers.getBlock(+route.params.id)
      blockHash.value = getHash(blockInfo.value.blockId.hash)
      blockParentHash.value = getHash(
        blockInfo.value.block.header.lastBlockId.hash
      )
    }

    onMounted(async (): Promise<void> => {
      await getBlock()
    })

    return {
      blockInfo,
      route,
      blockSize,
      blockHash,
      back,
      copyValue,
      formatDate,
      blockParentHash,
    }
  },
})
</script>
<style lang="scss" scoped>
.block {
  &-item {
    padding: 2.6rem 3.3rem;

    &__title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 400;

      & > * {
        margin-right: 2rem;
      }
    }

    @media screen and (max-width: 600px) {
      padding: 1.6rem;
    }
  }

  &-name {
    font-weight: 400;
    font-size: 3.2rem;

    @media screen and (max-width: 600px) {
      font-size: 2.8rem;
    }
  }

  &-row {
    display: flex;
    padding-bottom: 1.6rem;
    padding-top: 1.6rem;
    border-bottom: 0.1rem solid #cce4ff;

    &__title {
      max-width: 20.9rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        display: block;
        margin-right: 0.9rem;
      }
    }
  }

  &-id {
    text-overflow: ellipsis;
    max-width: 20rem;
    font-size: 2.4rem;
    font-weight: 400;
  }

  &-chars {
    padding-top: 1.9rem;

    .app-table__row {
      display: grid;
      grid-template-columns: 20.7rem 1fr;
      padding: 1.6rem 0 1.6rem;

      @media screen and (max-width: 600px) {
        grid-template-columns: 15rem 1fr;
      }
    }
  }

  &-back {
    min-width: 1.6rem;
  }
}

.info {
  &-value {
    display: flex;
    align-items: center;

    @media screen and (max-width: 992px) {
      span {
        max-width: 25rem;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    @media screen and (max-width: 500px) {
      span {
        max-width: 15rem;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  &-key {
    display: flex;
    width: 20.7rem;
    align-items: center;

    img {
      display: block;
      margin-right: 0.9rem;
      cursor: pointer;
    }

    div {
      position: relative;
      display: flex;
    }

    @media screen and (max-width: 600px) {
      width: 15rem;

      img {
        display: none;
      }
    }
  }
}

.text-blue {
  color: var(--clr__action);
}

.copy-button {
  display: block;
  margin-left: 1rem;
  width: 1.3rem;
  height: 1.5rem;

  &__wrapper {
    position: relative;

    @media screen and (max-width: 1800px) {
      .tooltip {
        left: auto;
        right: -1rem;
        bottom: 2.5rem;

        &:before {
          right: 0.9rem;
          left: auto;
          top: 5rem;
        }
      }
    }
  }
}

.info-key__inner img:hover + .tooltip,
.copy-button:hover + .tooltip {
  opacity: 1;
}

.tooltip {
  opacity: 0;
  position: absolute;
  left: -2.9rem;
  bottom: 2.5rem;
  transition: all 0.15s ease;
  border-radius: 1rem;
  white-space: nowrap;
  background: var(--clr__tooltip-new);
  padding: 1.2rem 2.4rem;
  color: #fff;
  pointer-events: none;
  z-index: 1;

  &:before {
    content: '';
    border-top: 1rem solid var(--clr__tooltip-new);
    border-right: 1rem solid transparent;
    border-left: 1rem solid transparent;
    position: absolute;
    left: 3.5rem;
    top: 5.1rem;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 1300px) {
    left: auto;
    right: 0;
    top: -300%;

    &:before {
      left: 90%;
      top: 108%;
      border-top: 1rem solid var(--clr__tooltip-new);
      border-right: 1rem solid transparent;
      border-left: 1rem solid transparent;
      border-bottom: none;
    }
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.info-key__inner .tooltip {
  &:before {
    left: 2.7rem;
  }
}
</style>
