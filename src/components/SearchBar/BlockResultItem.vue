<template>
  <template v-if="result">
    <router-link
      class="search__dropdown--item"
      :to="`/blocks/${result?.block?.header?.height}`"
    >
      <div class="search__dropdown--item-left">
        <div class="search__dropdown--item-label">Bk</div>
        <div class="search__dropdown--item-height">
          <TitledLink
            class="app-table__cell-txt"
            :text="result?.block?.header?.height"
          />
        </div>
        <div class="search__dropdown--item-time">
          {{ diffDays(toDay, getDay(result?.block?.header?.time)) }}
        </div>
      </div>
      <div class="search__dropdown--item-right">
        <div class="search__dropdown--item-validator">
          Validator:
          <TitledLink
            :link="`/transactions/${result?.block?.header?.height}`"
            class="app-table__cell-txt"
            :text="`${cropText(
              '0x' +
                toHexFunc(result?.block?.header?.validatorsHash).toUpperCase()
            )}`"
          />
        </div>
        <div class="search__dropdown--item-transactions">548 transactions</div>
      </div>
    </router-link>
  </template>
</template>

<script lang="ts">
import { toHexFunc } from '@/helpers/helpers'
import { defineComponent, ref } from 'vue'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  name: 'BlockResultItem',
  components: { TitledLink },
  props: { result: { type: Object, required: true } },
  setup() {
    const toDay = ref<Date>(new Date())

    return { toDay, diffDays, cropText, getDay, toHexFunc }
  },
})
</script>

<style lang="scss" scoped>
.search {
  &__dropdown {
    &--item {
      text-decoration: none;
      color: var(--clr__text);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
