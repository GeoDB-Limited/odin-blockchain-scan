<template>
  <template v-if="result">
    <router-link
      class="search__dropdown--item"
      :to="`/account/${result.address}`"
    >
      <div class="search__dropdown--item-left">
        <div class="search__dropdown--item-label">A</div>
        <div class="search__dropdown--item-height">
          <TitledLink
            class="app-table__cell-txt address-link"
            :link="`/account/${result.address}`"
            :text="`0x${result.address}`"
          />
        </div>
        <div class="search__dropdown--item-time"></div>
      </div>
      <div class="search__dropdown--item-right">
        <div class="search__dropdown--item-validator">
          Geo Balance:
          {{ geoBalance }}
        </div>
        <div class="search__dropdown--item-validator">
          <span> Odin Balance: </span>
          {{ odinBalance }}
        </div>
      </div>
    </router-link>
  </template>
</template>

<script lang="ts">
import { toHexFunc } from '@/helpers/helpers'
import { computed, defineComponent, ref } from 'vue'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import TitledLink from '@/components/TitledLink.vue'
import { bigMath } from '@/helpers/bigMath'

export default defineComponent({
  name: 'AccountItem',
  components: { TitledLink },
  props: { result: { type: Object, required: true } },
  setup(props) {
    const toDay = ref<Date>(new Date())

    const geoBalance = computed(() =>
      bigMath.bigConvectOdinAndGeo(props.result.geoBalance.amount)
    )
    const odinBalance = computed(() =>
      bigMath.bigConvectOdinAndGeo(props.result.odinBalance.amount)
    )

    return {
      toDay,
      diffDays,
      cropText,
      getDay,
      toHexFunc,
      geoBalance,
      odinBalance,
    }
  },
})
</script>

<style lang="scss" scoped>
.address-link {
  max-width: 14rem;
}
.search {
  &__dropdown {
    &--item {
      text-decoration: none;
      color: var(--clr__text);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      cursor: pointer;
      &-left {
        display: grid;
        grid-template-columns: 4.2rem 1fr;
        gap: 0 1rem;
        align-items: center;
      }
      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
        font-size: 1.3rem;
      }
      &-validator {
        display: flex;
        align-items: center;
        gap: 0 1rem;

        @media (max-width: 480px) {
          flex-direction: column;
          align-items: flex-start;
        }
      }
      &-label {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4.2rem;
        height: 4.2rem;
        background: var(--clr__input-border);
        border-radius: 4px;
        font-size: 2rem;
        line-height: 2.3rem;
        grid-row-start: 1;
        grid-row-end: 3;
      }
      &-time {
        grid-row-start: 2;
        grid-row-end: 3;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      &-transactions,
      &-time {
        font-size: 1.4rem;
        color: var(--clr__text-muted);
      }
      &:hover {
        background: rgba(#ced4da, 0.3);
      }
    }
    @media (max-width: 480px) {
      width: calc(100% - 19px);
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>
