<template>
  <div class="app__main-view accounts-item">
    <div class="app__main-view-title-wrapper">
      <BackButton text="Top accounts" />
      <h2 class="app__main-view-title accounts-item__title">Account</h2>
      <div
        class="app__main-view-subtitle-wrapper accounts-item__subtitle-wrapper"
      >
        <p class="app__main-view-subtitle fs-cut">
          {{ route.params.hash }}
        </p>
        <CopyButton class="mg-l8" :text="String(route.params.hash)" />
      </div>
    </div>

    <div class="accounts-item__stats mg-b32">
      <div class="accounts-item__stats-row">
        <span class="accounts-item__stats-title">GEO Balance:</span>
        <span class="accounts-item__stats-amount" :title="displayedGeoBalance">
          {{ displayedGeoBalance }}
        </span>
      </div>
      <div class="accounts-item__stats-row">
        <span class="accounts-item__stats-title">ODIN Balance:</span>
        <span class="accounts-item__stats-amount" :title="displayedOdinBalance">
          {{ displayedOdinBalance }}
        </span>
      </div>
    </div>

    <h1 class="app__main-view-subtitle mg-b32">
      <span>Transactions</span>
      <small class="mg-l8" v-if="totalTxCount">({{ totalTxCount }})</small>
    </h1>

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
      <div class="app-table__row">
        <p class="app-table__empty-stub">No items yet</p>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, defineComponent, computed } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { routerBack } from '@/router'
import { callers } from '@/api/callers'
import { convertToTxTime } from '@/helpers/dates'
import { copyValue } from '@/helpers/helpers'

import { Bech32 } from '@cosmjs/encoding'
import { bigMath } from '@/helpers/bigMath'
import { handleError } from '@/helpers/errors'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import TransitionLine from '@/components/TransitionLine.vue'

export default defineComponent({
  components: { BackButton, CopyButton, AppPagination, TransitionLine },
  setup() {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const geoBalance = ref<string>()
    const odinBalance = ref<string>()
    const transactions = ref()
    const totalTxCount = ref<number>()

    const page = ref<number>(1)
    const totalPages = ref<number>()
    // const ITEMS_PER_PAGE = 5

    const displayedGeoBalance = computed(() =>
      geoBalance.value ? `${geoBalance.value} GEO` : '0 GEO'
    )
    const displayedOdinBalance = computed(() =>
      odinBalance.value ? `${odinBalance.value} ODIN` : '0 ODIN'
    )

    const getTotalAmount = async (
      validatorAddress: string,
      denom: string
    ): Promise<string> =>
      callers
        .getUnverifiedBalances(validatorAddress, denom)
        .then((res) => bigMath.bigConvectOdinAndGeo(res.amount).toString())

    const getValidator = async () => {
      try {
        const validatorAddress = Bech32.encode(
          'odin',
          Bech32.decode(route.params.hash as string).data
        )

        // const { txs, totalCount } = await callers.getTxSearch({
        //   query: `message.sender='${route.params.hash}'`,
        //   page: page.value,
        //   per_page: ITEMS_PER_PAGE,
        //   order_by: 'desc',
        // })

        geoBalance.value = await getTotalAmount(validatorAddress, 'minigeo')
        odinBalance.value = await getTotalAmount(validatorAddress, 'loki')
        // transactions.value = await prepareTransaction(txs)
        // totalTxCount.value = totalCount
        // totalPages.value = Math.ceil(totalCount / ITEMS_PER_PAGE)
      } catch (e) {
        handleError(e as Error)
      }
    }

    onMounted(() => {
      getValidator()
    })
    const updateHandler = async () => {
      await getValidator()
    }

    return {
      route,
      displayedGeoBalance,
      displayedOdinBalance,
      routerBack,
      router,
      copyValue,
      convertToTxTime,
      transactions,
      totalTxCount,
      page,
      totalPages,
      updateHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.accounts-item {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__subtitle-wrapper {
    display: flex;
  }

  &__stats {
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.8rem;
    padding: 3.2rem 2.4rem;
    display: inline-block;
  }

  &__stats-row {
    display: grid;
    grid-template-columns: 10rem 1fr;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__stats-title {
    font-size: 1.6rem;
    width: 10rem;
    display: inline-block;
  }

  &__stats-amount {
    font-weight: 600;
    font-size: 1.6rem;
    margin-left: 2.4rem;
    @include ellipsis();
  }
}

@include respond-to(tablet) {
  .accounts-item {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }

    &__subtitle-wrapper {
      width: 100%;
    }

    &__stats {
      width: 100%;
    }
  }
}
</style>
