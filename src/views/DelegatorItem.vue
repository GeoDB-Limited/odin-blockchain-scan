<template>
  <div class="container">
    <div class="block-item">
      <div class="block-item__title">
        <button class="block-back" @click.prevent="routerBack(router)">
          <img src="~@/assets/icons/back-arrow.svg" alt="info" />
          <span>Delegators</span>
        </button>
        <h1 class="block-name">Delegate</h1>
        <div class="hash-wrapper">
          <span class="block-id">{{ route.params.hash }}</span>
          <div class="copy-button__wrapper">
            <button
              class="copy-button"
              @click.prevent="copyValue(route.params.hash)"
            >
              <img src="~@/assets/icons/copy.svg" alt="info" />
            </button>
            <div class="tooltip">Copy From Delegator Hash to clipboard.</div>
          </div>
        </div>
      </div>
      <div class="stats-wrapper mg-b32">
        <div class="stats-info">
          <div class="stats-row">
            <span class="title">Balance:</span>
            <span class="amount">12,523,093 ODIN {{ delegatorBalance }} </span>
          </div>
          <div class="stats-row">
            <span class="title">Stake</span>
            <span class="amount">210.0000 ODIN {{ delegatorStake }}</span>
          </div>
        </div>
      </div>
      <h1 class="mg-b32">Staking transactions</h1>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head validators-head">
          <div class="app-table__cell" data-tooltip="">
            <span class="app-table__cell-txt"> Transaction hash </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Date and time </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Block </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Sender </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transactions amount </span>
          </div>
        </div>
        <template v-if="blocks?.length">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="data-sources__table-row app-table__row validators-row"
          >
            <div class="app-table__cell">
              <span class="app-table__header">Transaction hash</span>
              <TitledLink
                :to="`/blocks/block height`"
                class="app-table__cell-txt"
                :text="'block height'"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Date and time</span>
              <div>
                <div class="info-value">
                  {{ convertToTime(item.time) }}
                </div>
                <div class="info-value">
                  {{ convertToDate(item.time) }}
                </div>
              </div>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Block</span>
              <span class="app-table__cell-txt">{{ 'Block' }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Sender</span>
              <span class="app-table__cell-txt">{{ 'Sender' }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Transaction amount</span>
              <span class="app-table__cell-txt">{{
                'Transaction amount'
              }}</span>
            </div>
          </div>
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
import { ref, onMounted, defineComponent } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { routerBack } from '@/router'

// import { callers } from '@/api/callers'
import TitledLink from '@/components/TitledLink.vue'
// import { Bech32 } from '@cosmjs/encoding'

import {
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupStakingExtension,
  setupIbcExtension,
} from '@cosmjs/stargate'

import { Tendermint34Client } from '@cosmjs/tendermint-rpc'

import { API_CONFIG } from '@/api/api-config'

import { convertDate, copyValue } from '@/helpers/helpers'

export default defineComponent({
  components: { TitledLink },
  setup() {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()

    const blocks = ref()
    const delegatorBalance = ref()
    const delegatorStake = ref()

    const getValidator = async (): Promise<void> => {
      // const validatorAddress = Bech32.encode('odin', Bech32.decode(route.params.hash).data)

      const client = QueryClient.withExtensions(
        await Tendermint34Client.connect(API_CONFIG.rpc),
        setupAuthExtension,
        setupBankExtension,
        setupDistributionExtension,
        setupStakingExtension,
        setupIbcExtension
      )

      console.log(
        client.staking.unverified.validator(String(route.params.hash))
      )

      // response.validator(+route.params.id).then((res) => {
      //   validatorInfo.value = res
      //   validatorHash.value = getHash(validatorInfo.value.validatorId.hash)
      //   validatorParentHash.value = getHash(
      //     validatorInfo.value.validator.header.lastValidatorId.hash
      //   )
      // })
    }

    onMounted(async () => {
      await getValidator()
    })

    return {
      router,
      route,
      delegatorBalance,
      delegatorStake,
      routerBack,
      copyValue,
      convertDate,
      blocks,
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
      margin-bottom: 3.2rem;

      & > * {
        margin-right: 2rem;
      }

      @media screen and (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media screen and (max-width: 600px) {
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
    border-bottom: 1px solid #cce4ff;

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

  &-id {
    font-size: 24px;
    font-weight: 400;
    text-transform: uppercase;

    @media screen and (max-width: 1000px) {
      text-overflow: ellipsis;
      max-width: 50vw;
      overflow: hidden;
    }

    @media screen and (max-width: 600px) {
      max-width: 80vw;
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

    span {
      display: none;
    }

    @media screen and (max-width: 600px) {
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        font-size: 16px;
        color: var(--clr__action);
        margin-left: 10px;
      }
    }
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
    border-top: 10px solid var(--clr__tooltip-new);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    position: absolute;
    left: 35px;
    top: 51px;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 1300px) {
    left: auto;
    right: 0;
    top: -300%;

    &:before {
      left: 90%;
      top: 108%;
      border-top: 10px solid var(--clr__tooltip-new);
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: none;
    }
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.info-key__inner .tooltip {
  &:before {
    left: 27px;
  }
}

.hash-wrapper {
  display: flex;
  align-items: center;
}

.data-sources__table-head {
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

.stats {
  &-wrapper {
    border: 1px solid var(--clr__action);
    border-radius: 8px;
    padding: 3.2rem 2.4rem;
    display: inline-block;

    .title {
      font-size: 16px;
      width: 100px;
      display: inline-block;
    }

    .amount {
      font-weight: 600;
      font-size: 16px;
    }
  }

  &-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    // margin-bottom: 24px;
    align-items: center;
    font-size: 16px;

    span + span {
      margin-left: 10px;
      display: inline-block;
    }

    .amount {
      font-weight: 600;
    }

    & + .stats-row {
      margin-top: 24px;
    }
  }
}
</style>
