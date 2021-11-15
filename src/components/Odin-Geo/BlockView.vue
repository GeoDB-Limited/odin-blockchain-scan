<template>
  <div class="block-view">
    <div class="title">
      {{ blockData.info.name }}
    </div>
    <div class="info-box">
      <div class="info-box__total-supply">
        <span>Total Supply:</span>
        <span>{{ blockData.info.supply }} ODIN </span>
      </div>
      <div class="info-box__precision">
        <span>Precision:</span>
        <span>{{ blockData.info.precision }}</span>
      </div>
    </div>
    <div class="amount-block">
      <div class="amount-block__title">Amount of ODIN tokens</div>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell">
            <span class="app-table__cell-txt">Balances</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt">Community pool</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt">Treasury pool</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt">Data providers pool</span>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row validators-row">
          <div class="app-table__cell">
            <span class="app-table__header">
              {{ blockData.amount.balances }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">
              {{ blockData.amount.community_pool }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">
              {{ blockData.amount.treasury_pool }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">
              {{ blockData.amount.providers_pool }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlockView',
  props: {
    blockData: {
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.app-table {
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
  &__header {
    font-weight: 600;
  }
  &__head {
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      padding: 0;
      width: 50%;
      gap: 1.8rem;
    }
  }
  &__row {
    padding: 3.2rem 0 1.6rem;
    @media (max-width: 768px) {
      padding: 0;
      width: 50%;
      border: none;
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
      .app-table__cell {
        justify-content: flex-end;
      }
    }
  }
}

.block-view {
  margin-bottom: 4.8rem;
  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
}

.title {
  color: var(--clr__text);
  font-size: 2.4rem;
  font-weight: 400;
  line-height: 3.2rem;
  margin-bottom: 2.4rem;
}

.info-box {
  display: inline-block;
  padding: 3.2rem 2.4rem;
  border: 0.2rem solid var(--clr__action);
  border-radius: 0.8rem;
  margin-bottom: 4rem;
  min-width: 29.8rem;
  &__total-supply {
    margin-bottom: 2.4rem;
  }
  &__precision,
  &__total-supply {
    display: flex;
    justify-content: space-between;
    color: var(--clr__text);
    span {
      width: 50%;
      &:last-child {
        display: flex;
        white-space: nowrap;
        font-weight: 600;
      }
    }
    @media (max-width: 768px) {
      font-size: 1.4rem;
      span {
        &:last-child {
          display: flex;
          justify-content: flex-start;
        }
      }
    }
  }
  @media (max-width: 768px) {
    padding: 3.2rem 2.4rem;
    min-width: unset;
    width: 100%;
  }
}

.amount-block {
  &__title {
    font-weight: 600;
    font-size: 2rem;
    line-height: 2.4rem;
    color: var(--clr__text);
    padding-bottom: 1.6rem;
  }
  @media (max-width: 768px) {
    padding-bottom: 2rem;
    border-bottom: 0.1rem solid var(--clr__text-muted);
  }
}
</style>
