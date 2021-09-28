import { BlockResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { TransactionListFormatted } from '@/helpers/makeTransactionListFormatted'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { BlockMeta } from '@cosmjs/tendermint-rpc'

export type Link = {
  to?: string
  text?: string
  title?: string
}
export type LinkList = {
  name: string
  links: Array<Link>
}

export type ChartDataSetsType = {
  backgroundColor: string
  borderColor: string
  borderWidth: string | number
  borderJoinStyle: string
  borderCapStyle: string
  tension: number
  borderSkipped: boolean
  data: Array<string | number>
}

export type ChartDataType = {
  labels: Array<string | Date>
  datasets: Array<ChartDataSetsType>
}

export type CoingeckoCoinsType = {
  data: {
    name: string
    market_data: {
      current_price: { usd: string }
      market_cap: { usd: string }
      total_supply: number | string
    }
  }
}

export type SearchResultType = {
  blocks?: Array<searchBlocksInterface>
  transactions?: Array<TransactionListFormatted>
  accounts?: Array<TempSearchAccountInfoType>
}

export type TempSearchAccountInfoType = {
  address: string
  geoBalance: Coin
  odinBalance: Coin
}

export type CoinBlocksDataType = {
  info: {
    name: string
    supply: number | string
    precision: string
  }
  amount: {
    balances: string
    community_pool: string
    treasury_pool: string
    providers_pool: string
  }
}

export type TempBalanceType = {
  address: string
  geoBalance: number
  odinBalance: number
  total_tx?: number
}

export type adjustedData = {
  voter?: string
  type: string
  hash?: string
  block?: string | number | undefined
  delegatorAddress?: string
  time?: Date | string | null
  sender?: string
  receiver?: string
  amount?: string
  fee?: string
  status?: number | string | undefined
}

export interface latestBlocksInterface extends BlockMeta {
  total_tx: string | number
}

export interface searchBlocksInterface extends BlockResponse {
  total_tx?: string | number
}
