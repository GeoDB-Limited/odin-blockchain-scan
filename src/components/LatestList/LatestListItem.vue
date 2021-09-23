<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <div class="latest-list-item__label">
        <slot name="label" />
      </div>
      <div class="latest-list-item__name">
        <slot name="name" />
      </div>
      <div class="latest-list-item__time">
        <slot name="time" />
      </div>
    </div>
    <div class="latest-list-item__center">
      <div class="latest-list-item__validator">
        <slot name="validator" />
        <slot name="from" />
      </div>
      <div class="latest-list-item__transactions">
        <slot name="transactions" />
      </div>
      <div class="latest-list-item__to">
        <slot name="to" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LatestListItem',
})
</script>

<style lang="scss">
.latest-list-item {
  display: grid;
  grid: auto/ repeat(2, minmax(9.3rem, 1fr));
  padding-bottom: 2.4rem;
  border-bottom: 0.1px solid var(--clr__input-border);
  gap: 2.4rem;
  align-items: center;
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
  &__left {
    display: grid;
    grid-template-columns: 4.2rem auto;
    grid-template-rows: 1fr;
    gap: 0 0.8rem;
    align-items: center;
  }
  &__name {
    grid-row-start: 1;
    grid-row-end: 2;
    a {
      text-decoration: none;
      color: var(--clr__action);
    }
  }
  &__time {
    grid-row-start: 2;
    grid-row-end: 3;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.4rem;
    color: var(--clr__text-muted);
  }
  &__label {
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
  &__center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 0.8rem;
  }
  &__validator,
  &__to {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    width: 100%;
  }
  &__transactions {
    color: var(--clr__text-muted);
  }
  &__right {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--clr__text);
  }

  @media (max-width: 768px) {
    grid: auto/ repeat(2, 1fr);
    align-items: flex-start;
    &__left {
      grid-template-columns: 1fr;
    }
    &__label {
      display: none;
    }
    &__right {
      justify-content: left;
    }
  }
}
</style>
