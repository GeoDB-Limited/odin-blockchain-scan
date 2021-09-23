<template>
  <div class="container">
    <div class="block-item">
      <div class="block-item__title">
        <BackButton :current-router="router" />
        <h1 class="block-name">Transaction</h1>
        <CopyText
          v-if="transaction?.hash"
          :text="transaction?.hash"
          :className="'block-id'"
          :title="transaction?.hash"
          :displayText="transaction?.hash"
        />
      </div>
      <div class="block-chars">
        <h2 class="block-title">Transaction details</h2>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The date and time at which a transaction is validated.
              </span>
              Time
            </div>
          </div>
          <div class="info-value">
            <span>{{ convertToTxTime(transaction?.time) }}</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The status of the transaction. A Status code indicating if the
                top-level call succeeded or failed.
              </span>
              Status
            </div>
          </div>
          <div class="info-value text-blue">
            <div
              class="status"
              :class="transaction?.status === 0 ? 'success' : 'failed'"
            >
              {{ transaction?.status === 0 ? 'Success' : 'Failed' }}
            </div>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The number of the block in which the transaction was recorded.
                Block confirmation indicate how many blocks since the
                transaction are validated.
              </span>
              Block
            </div>
          </div>
          <div class="info-value">
            <router-link :to="`/blocks/${transaction?.block}`">
              {{ transaction?.block }}
            </router-link>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The sending party of the transaction (could be from a contract
                address).
              </span>
              Sender
            </div>
          </div>
          <div class="info-value">
            <router-link :to="`/account/${transaction?.sender}`">
              {{ transaction?.sender }}
            </router-link>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The receiving party of the transaction (could be a contract
                address).
              </span>
              Gas (used/wanted)
            </div>
          </div>
          <div class="info-value">
            <span>{{ transUsed }}/{{ transWanted }}</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                Amount paid to the validator for validation of the transaction.
              </span>
              Fee
            </div>
          </div>
          <div class="info-value">
            {{ transaction?.fee }}
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                Amount paid to the validator for validation of the transaction.
              </span>
              Memo
            </div>
          </div>
          <div class="info-value">
            <span>{{ transMemo ? transMemo : 'No Memo' }}</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <div class="info-key__inner">
              <img src="~@/assets/icons/info.svg" alt="info" />
              <span class="tooltip">
                The amount being transacted in ODIN and fiat value.
              </span>
              Total
            </div>
          </div>
          <div class="info-value">
            <span>{{ transaction?.amount }}</span>
          </div>
        </div>
        <div class="transactions-messages mg-t32">
          <h2 class="block-title mg-b16">Messages</h2>
          <div class="transactions-messages__container">
            <h3>
              {{ transaction?.type }}
            </h3>
            <div class="data-sources__table-row app-table__row">
              <div class="info-key">
                <div class="info-key__inner">
                  <img src="~@/assets/icons/info.svg" alt="info" />
                  <span class="tooltip"> Text </span>
                  From
                </div>
              </div>
              <div class="info-value">
                <router-link :to="`/account/${transaction?.sender}`">
                  {{ transaction?.sender }}
                </router-link>
              </div>
            </div>
            <div class="data-sources__table-row app-table__row">
              <div class="info-key">
                <div class="info-key__inner">
                  <img src="~@/assets/icons/info.svg" alt="info" />
                  <span class="tooltip"> Text </span>
                  To
                </div>
              </div>
              <div class="info-value">
                <router-link :to="`/account/${transaction?.receiver}`">
                  {{ transaction?.receiver }}
                </router-link>
              </div>
            </div>
            <div class="data-sources__table-row app-table__row">
              <div class="info-key">
                <div class="info-key__inner">
                  <img src="~@/assets/icons/info.svg" alt="info" />
                  <span class="tooltip"> Text </span>
                  Amount
                </div>
              </div>
              <div class="info-value">
                <span>{{ transaction?.amount }}</span>
              </div>
            </div>
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
import { routerBack } from '@/router'
import { callers } from '@/api/callers'
import { ReadonlyDateWithNanoseconds } from '@cosmjs/tendermint-rpc/build/dates'
import { adjustedData } from '@/helpers/Types'
import { convertToTxTime } from '@/helpers/dates'
import { copyValue, prepareTransaction } from '@/helpers/helpers'
import { getDecodeTx } from '@/helpers/decodeMessage'
import CopyText from '@/components/CopyText.vue'
import BackButton from '@/components/BackButton.vue'

export default defineComponent({
  name: 'TransactionsItem',
  components: { CopyText, BackButton },
  setup() {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()

    const transMemo = ref<string | undefined>()
    const transUsed = ref<number>()
    const transWanted = ref<number>()
    const transTime = ref<ReadonlyDateWithNanoseconds>()
    const transaction = ref<adjustedData>()

    const getTransaction = async (): Promise<void> => {
      const { txs } = await callers.getTxSearch({
        query: `tx.height = ${route.params.height}`,
      })

      const { blockMetas } = await callers.getBlockchain(
        Number(route.params.height),
        Number(route.params.height)
      )
      transTime.value = blockMetas[0].header.time
      const decodedTx = getDecodeTx(txs[0].tx)
      await prepareTransaction(txs).then((tx) => {
        transaction.value = { ...tx[0], status: txs[0].result.code }
      })
      transMemo.value = decodedTx?.body?.memo
      const {
        data: {
          result: {
            tx_result: { gas_wanted, gas_used },
          },
        },
      } = await callers.getTxForTxDetailsPage(transaction.value?.hash as string)

      transWanted.value = gas_wanted
      transUsed.value = gas_used
    }

    onMounted(async (): Promise<void> => {
      await getTransaction()
    })

    return {
      transaction,
      route,
      router,
      transMemo,
      transWanted,
      transUsed,
      transTime,
      convertToTxTime,
      routerBack,
      copyValue,
    }
  },
})
</script>
<style lang="scss" scoped>
h2,
h3 {
  font-weight: 400;
}

a {
  color: var(--clr__action);
  text-decoration: none;
}

.block {
  &-item {
    padding: 2.6rem 3.3rem;

    &__title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 400;

      & > * {
        margin-right: 20px;
      }
    }

    @media screen and (max-width: 992px) {
      padding: 1.6rem;
    }
  }

  &-name {
    font-weight: 400;
    font-size: 32px;

    @media screen and (max-width: 600px) {
      font-size: 28px;
    }
  }

  &-row {
    display: flex;
    padding-bottom: 1.6rem;
    padding-top: 1.6rem;
    // border-bottom: 1px solid #cce4ff;
    border-bottom: 1px solid var(--clr-input-border);

    &__title {
      max-width: 209px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        display: block;
        margin-right: 9px;
      }
    }
  }

  &-chars {
    padding-top: 1.9rem;

    .app-table__row {
      display: grid;
      grid-template-columns: 207px 1fr;
      padding: 1.6rem 0 1.6rem;

      @media screen and (max-width: 600px) {
        grid-template-columns: 150px 1fr;
      }
    }
  }

  &-back {
    min-width: 16px;
  }
}

.info {
  &-value {
    display: flex;
    align-items: center;

    @media screen and (max-width: 992px) {
      span {
        max-width: 250px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    @media screen and (max-width: 500px) {
      span {
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  &-key {
    display: flex;
    width: 207px;
    align-items: center;

    img {
      display: block;
      margin-right: 9px;
      cursor: pointer;
    }

    div {
      position: relative;
      display: flex;
    }

    @media screen and (max-width: 600px) {
      width: 150px;

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
  margin-left: 10px;
  width: 13px;
  height: 15px;

  &__wrapper {
    position: relative;

    @media screen and (max-width: 1800px) {
      .tooltip {
        left: auto;
        right: -10px;
        bottom: 25px;

        &:before {
          right: 9px;
          left: auto;
          top: 50px;
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
  left: -29px;
  bottom: 25px;
  transition: all 0.15s ease;
  border-radius: 10px;
  white-space: nowrap;
  background: var(--clr__tooltip-new);
  padding: 12px 24px;
  color: #fff;
  pointer-events: none;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    left: 35px;
    top: 51px;
    border-top: 10px solid var(--clr__tooltip-new);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 992px) {
    max-width: 90vw;
    min-width: 50vw;
    white-space: break-spaces;
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.transactions-messages {
  &__container {
    border: 1px solid var(--clr__action);
    border-radius: 8px;
    padding: 3.2rem 2.4rem;

    .app-table__row {
      border: none;
    }
  }
}

.status {
  width: 100px;
  height: 24px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  &.success {
    background: #00d097;
  }

  &.failed {
    background: #f65160;
  }
}

.info-key__inner .tooltip {
  &:before {
    left: 27px;
  }
}
</style>
