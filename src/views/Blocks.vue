<template>
  <div class="container">
    <div class="mg-b16 mg-t32">
      <h2 class="view-title" title="some blocks">Blocks</h2>
    </div>
    <div class="mg-b16 mg-t16" v-if="filteredBlocks?.length">
      <p>{{ blocks?.length }} blocks found</p>
    </div>
    <div class="app-table">
      <div class="data-sources__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Block </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Date and time </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Transactions </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Validator </span>
        </div>
      </div>
      <template v-if="filteredBlocks?.length">
        <div
          v-for="item in filteredBlocks"
          :key="item.id"
          class="data-sources__table-row app-table__row"
        >
          <div class="app-table__cell">
            <span class="app-table__header">Block</span>
            <TitledLink
              :to="`/blocks/${item.header.height}`"
              class="app-table__cell-txt"
              :text="item.header.height"
            />
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Date and time</span>
            <div>
              <div class="info-value">
                {{ convertToTime(item.header.time) }}
              </div>
              <div class="info-value">
                {{ convertToDate(item.header.time) }}
              </div>
            </div>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Transactions</span>
            <span class="app-table__cell-txt">{{ item.num_txs }}</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Validator</span>
            <TitledLink
              class="app-table__cell-txt"
              :text="'0x' + toHexFunc(item.header.validatorsHash).toUpperCase()"
            />
            <div class="tooltip">
              {{ '0x' + toHexFunc(item.header.validatorsHash).toUpperCase() }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
    </div>
    <div class="pagination-wrapper mg-t32">
      <v-pagination
        v-model="page"
        :pages="totalPages"
        :range-size="1"
        active-color="#007bff"
        @update:modelValue="updateHandler"
        :hideFirstButton="true"
        :hideLastButton="true"
      >
      </v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { toHexFunc } from '@/helpers/helpers'
import TitledLink from '@/components/TitledLink.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { convertToTime, convertToDate } from '@/helpers/dates'

export default defineComponent({
  name: 'Blocks',
  components: { TitledLink, VPagination },
  setup() {
    const blocks = ref()
    const filteredBlocks = ref()
    const blocksPerPage = 5
    const page = ref<number>(1)
    const totalPages = ref<number>()

    const getBLocks = async (): Promise<void> => {
      const { blockMetas } = await callers.getBlockchain()
      blocks.value = [...blockMetas]
      totalPages.value = Math.ceil(blocks.value.length / blocksPerPage)
      filterBlocks(page.value)
    }

    const filterBlocks = (newPage: number): void => {
      let tempArr = blocks.value

      if (newPage === 1) {
        filteredBlocks.value = tempArr.slice(0, newPage * blocksPerPage)
      } else {
        filteredBlocks.value = tempArr.slice(
          (newPage - 1) * blocksPerPage,
          (newPage - 1) * blocksPerPage + blocksPerPage
        )
      }
      page.value = newPage
    }

    const updateHandler = (num: number): void => {
      filterBlocks(num)
    }

    onMounted(async (): Promise<void> => {
      await getBLocks()
    })

    return {
      blocks,
      page,
      totalPages,
      filteredBlocks,
      filterBlocks,
      updateHandler,
      convertToTime,
      convertToDate,
      toHexFunc,
    }
  },
})
</script>

<style scoped lang="scss">
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    repeat(4, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(4, minmax(4rem, 1fr)) / auto;
  }
}

.blocks-container {
  border-top: 0.1rem solid var(--clr__table-border);
}

.app-table__row {
  padding: 3.2rem 0 2rem;

  @media screen and (max-width: 992px) {
    padding: 1.6rem 0 0 0;
  }
}

.app-table__cell {
  position: relative;
}

.app-table__cell-txt {
  max-width: 20rem;

  @media screen and (max-width: 600px) {
    max-width: 15rem;
  }
}

.view-title {
  font-weight: 400;
  font-size: 3.2rem;

  @media screen and (max-width: 600px) {
    font-size: 2.8rem;
  }
}

.app-table__cell-txt:hover + .tooltip {
  opacity: 1;
}

.tooltip {
  opacity: 0;
  position: absolute;
  left: 0;
  bottom: 100%;
  transform: translateY(-50%);
  transition: all 0.15s ease;
  border-radius: 10px;
  //white-space: nowrap;
  word-break: break-all;
  background: var(--clr__tooltip-new);
  padding: 1.2rem 2.4rem;
  color: #fff;
  z-index: 1;
  pointer-events: none;

  &:before {
    content: '';
    border-top: 1rem solid var(--clr__tooltip-new);
    border-right: 1rem solid transparent;
    border-left: 1rem solid transparent;
    position: absolute;
    left: 2rem;
    top: 100%;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.currency {
  text-transform: uppercase;
}

.app-table__head {
  @media screen and (max-width: 992px) {
    display: none;
  }
}

.app-table__header {
  display: none;
  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 20rem;
  }
}
</style>
<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.4rem;
    margin: 0 0.4rem;
    min-width: 2.6rem;
    height: 3.6rem;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 1rem;
  }

  .Page {
    color: var(--clr__action);

    &:hover {
      border: none;
    }
  }
  .Page-active {
    color: #fff;
  }

  .PaginationControl .Control.Control-active {
    fill: var(--clr__action);
  }
  .PaginationControl .Control {
    fill: #cce4ff;
  }

  .DotsHolder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    svg,
    path {
      color: var(--clr__action);
    }
  }
}
</style>
