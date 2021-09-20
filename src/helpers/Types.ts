import { BlockResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { TransactionListFormatted } from '@/helpers/makeTransactionListFormatted'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'

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
  blocks?: Array<BlockResponse>
  transactions?: Array<TransactionListFormatted>
  accounts?: Array<TempBalanceType>
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
  type?: string
  delegatorAddress?: string
  time?: Date | undefined | string
  sender?: string
  receiver?: string
  amount?: string | Coin | Array<Coin> | undefined
  fee?: string
}
