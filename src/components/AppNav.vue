<template>
  <div class="app-nav" :class="{ ['app-nav_mobile']: isOpen }">
    <div class="app-nav__wrap-cont">
      <LinksDropdown :list="BlockchainList" @redirect="changeRoute" />
      <LinksDropdown :list="ResourceList" @redirect="changeRoute" />
      <router-link
        @click="changeRoute"
        class="app-nav__link"
        data-text="IBCs"
        :to="{ name: 'IBC' }"
      >
        <span>IBCs</span>
      </router-link>
    </div>
    <UserWidget />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LinksDropdown from '@/components/LinksDropdown.vue'
import UserWidget from '@/components/UserWidget.vue'
import { LinkList } from '@/helpers/Types'

export default defineComponent({
  name: 'AppNav',
  components: {
    LinksDropdown,
    UserWidget,
  },
  props: {
    isOpen: { type: Boolean, default: false },
  },

  setup(_, { emit }) {
    const BlockchainList: LinkList = {
      name: 'Blockchain',
      links: [
        {
          to: 'Transactions',
          text: 'Transactions',
        },
        {
          to: 'Blocks',
          text: 'Blocks',
        },
        {
          to: 'Validators',
          text: 'Validators',
        },
        {
          to: 'TopAccounts',
          text: 'Top Accounts',
        },
      ],
    }
    const TokenomicList: LinkList = {
      name: 'Tokenomics',
      links: [
        {
          to: 'Tokenomics',
          text: 'Tokenomics overview',
        },
        {
          to: 'odin&geo',
          text: 'ODIN&GEO',
        },
      ],
    }
    const ResourceList: LinkList = {
      name: 'Resources',
      links: [
        {
          to: 'Chart&Stats',
          text: 'Charts & Stats',
        },
      ],
    }

    const changeRoute = () => {
      emit('changeRoute')
    }

    return { BlockchainList, TokenomicList, ResourceList, changeRoute }
  },
})
</script>

<style lang="scss" scoped>
.app-nav {
  display: flex;
  width: 100%;
  align-items: center;

  &__wrap-cont {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    gap: 2.4rem;
  }
  &__link {
    display: grid;
    grid-template-columns: 100%;
    text-decoration: none;
    white-space: nowrap;
    color: inherit;
    font-weight: 400;
    line-height: 2.4rem;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: var(--clr__action);
    }

    &::before {
      content: attr(data-text);
      font-weight: 900;
      opacity: 0;
      grid-column: 1;
      grid-row: 1;
    }
    > span {
      text-align: center;
      grid-column: 1;
      grid-row: 1;
      transition: color 0.5s ease, font-weight 0.5s ease;
    }
    &.router-link-exact-active > span {
      font-weight: bold;
      color: var(--clr__action);
    }
  }
}

@include respond-to(tablet) {
  .app-nav {
    display: none;
    background: #fff;
    width: 100%;
    z-index: 1;
    height: calc(100vh - 8.4rem);
    padding: 2.4rem 1.6rem;
    border-top: 0.1rem solid var(--clr__table-border);

    &__wrap-cont {
      flex-direction: column;
      gap: 0;
      margin-bottom: 2.4rem;
    }
    &__link {
      width: 100%;
      padding: 2.4rem 1.2rem;
      border-bottom: 0.1rem solid #ced4da;
      > span {
        text-align: left;
      }

      &:hover {
        background: rgba(204, 228, 255, 0.4);
      }

      &:first-child {
        padding: 2.4rem 1.2rem;
      }
    }

    &_mobile {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: fixed;
      top: 8.4rem;
      left: 0;
      overflow-y: auto;
    }
  }
}
</style>
