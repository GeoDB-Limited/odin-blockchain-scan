import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import {
  MsgSubmitProposal,
  MsgVote,
  MsgDeposit,
} from '@provider/codec/cosmos/gov/v1beta1/tx'
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
import { MsgCreateVestingAccount } from 'cosmjs-types/cosmos/vesting/v1beta1/tx.js'
import {
  MsgActivate,
  MsgAddReporter,
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgReportData,
  MsgRequestData,
  MsgEditOracleScript,
  MsgEditDataSource,
} from '@provider/codec/oracle/v1/tx'
import {
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx'
import { callers } from '@/api/callers'
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { ReadonlyDateWithNanoseconds } from '@cosmjs/tendermint-rpc/build/dates'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { adjustedData } from '@/helpers/Types'
import {
  MsgCreateClient,
  MsgUpdateClient,
} from 'cosmjs-types/ibc/core/client/v1/tx'
import { MsgConnectionOpenInit } from 'cosmjs-types/ibc/core/connection/v1/tx'
import { MsgChannelOpenInit } from 'cosmjs-types/ibc/core/channel/v1/tx'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { MsgUnjail } from 'cosmjs-types/cosmos/slashing/v1beta1/tx'

export const getDecodeTx = (tx: TxResponse['tx']): Tx => Tx.decode(tx)

const getTime = async (
  height: number
): Promise<ReadonlyDateWithNanoseconds> => {
  const res = await callers.getBlockchain(height, height)
  return res.blockMetas[0].header.time
}

export function humanizeMessageType(type: string): string {
  switch (type) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return 'Withdraw'

    case '/cosmos.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgDeposit':
      return 'Deposit'

    case '/cosmos.gov.v1beta1.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return 'Submit Proposal'

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return 'Create Validator'

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return 'Delegate'

    case '/cosmos.bank.v1beta1.MsgSend':
      return 'Send'

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return 'Undelegate'

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return 'Edit Validator'

    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      return 'Begin Redelegate'

    case '/oracle.v1.MsgActivate':
      return 'Activate'

    case '/oracle.v1.MsgCreateDataSource':
      return 'Create Data Source'

    case '/oracle.v1.MsgCreateOracleScript':
      return 'Create Oracle Script'

    case '/oracle.v1.MsgAddReporter':
      return 'Add Reporter'

    case '/oracle.v1.MsgRequestData':
      return 'Request Data'

    case '/oracle.v1.MsgReportData':
      return 'Report Data'

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return 'Withdraw delegator reward'

    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return 'Withdraw validator commission'

    case '/cosmos.slashing.v1beta1.MsgUnjail':
      return 'Unjail'

    case '/ibc.core.client.v1.MsgCreateClient':
      return 'Create IBC Client'

    case '/ibc.core.connection.v1.MsgConnectionOpenInit':
      return 'Connection Open Init'

    case '/ibc.core.client.v1.MsgUpdateClient':
      return 'Update IBC Client'

    case '/ibc.core.channel.v1.MsgChannelOpenInit':
      return 'Chanel Open Init'

    case '/ibc.applications.transfer.v1.MsgTransfer':
      return 'IBC Transfer'

    case '/cosmos.vesting.v1beta1.MsgCreateVestingAccount':
      return 'Create Vesting Account'

    case '/oracle.v1.MsgEditDataSource':
      return 'Edit Data Source'

    case '/oracle.v1.MsgEditOracleScript':
      return 'Edit OracleScript'

    default:
      throw new ReferenceError(`Unknown type ${type}`)
  }
}

function decodeMessage(obj: {
  typeUrl: string
  value: Uint8Array
}):
  | MsgWithdrawCoinsToAccFromTreasury
  | MsgCreateValidator
  | MsgEditValidator
  | MsgDelegate
  | MsgUndelegate
  | MsgBeginRedelegate
  | MsgSend
  | MsgVote
  | MsgDeposit
  | MsgSubmitProposal
  | MsgAddReporter
  | MsgActivate
  | MsgCreateOracleScript
  | MsgCreateDataSource
  | MsgRequestData
  | MsgReportData
  | MsgCreateClient
  | MsgConnectionOpenInit
  | MsgUpdateClient
  | MsgChannelOpenInit
  | MsgTransfer
  | MsgWithdrawValidatorCommission
  | MsgUnjail
  | MsgCreateVestingAccount
  | MsgEditDataSource
  | MsgEditOracleScript {
  switch (obj.typeUrl) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return MsgCreateValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return MsgDelegate.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return MsgUndelegate.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgVote':
      return MsgVote.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgDeposit':
      return MsgDeposit.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return MsgSubmitProposal.decode(obj.value)

    case '/cosmos.bank.v1beta1.MsgSend':
      return MsgSend.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return MsgEditValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      return MsgBeginRedelegate.decode(obj.value)

    case '/oracle.v1.MsgActivate':
      return MsgActivate.decode(obj.value)

    case '/oracle.v1.MsgCreateDataSource':
      return MsgCreateDataSource.decode(obj.value)

    case '/oracle.v1.MsgEditDataSource':
      return MsgEditDataSource.decode(obj.value)

    case '/oracle.v1.MsgCreateOracleScript':
      return MsgCreateOracleScript.decode(obj.value)

    case '/oracle.v1.MsgEditOracleScript':
      return MsgEditOracleScript.decode(obj.value)

    case '/oracle.v1.MsgAddReporter':
      return MsgAddReporter.decode(obj.value)

    case '/oracle.v1.MsgRequestData':
      return MsgRequestData.decode(obj.value)

    case '/oracle.v1.MsgReportData':
      return MsgReportData.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return MsgWithdrawDelegatorReward.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return MsgWithdrawValidatorCommission.decode(obj.value)

    case '/cosmos.slashing.v1beta1.MsgUnjail':
      return MsgUnjail.decode(obj.value)

    case '/ibc.core.client.v1.MsgCreateClient':
      return MsgCreateClient.decode(obj.value)

    case '/ibc.core.connection.v1.MsgConnectionOpenInit':
      return MsgConnectionOpenInit.decode(obj.value)

    case '/ibc.core.client.v1.MsgUpdateClient':
      return MsgUpdateClient.decode(obj.value)

    case '/ibc.core.channel.v1.MsgChannelOpenInit':
      return MsgChannelOpenInit.decode(obj.value)

    case '/ibc.applications.transfer.v1.MsgTransfer':
      return MsgTransfer.decode(obj.value)

    case '/cosmos.vesting.v1beta1.MsgCreateVestingAccount':
      return MsgCreateVestingAccount.decode(obj.value)

    default:
      throw new ReferenceError(`Unknown type ${obj.typeUrl}`)
  }
}

export async function getDateFromMessage(
  tx: TxResponse
): Promise<adjustedData> {
  const obj = getDecodeTx(tx.tx)?.body?.messages[0] as {
    typeUrl: string
    value: Uint8Array
  }
  const message = decodeMessage(obj)
  const adjustedData: adjustedData = {
    type: humanizeMessageType(obj.typeUrl),
    time: (await getTime(Number(tx.height))) as Date,
    fee: getDecodeTx(tx.tx)?.authInfo?.fee?.amount[0]?.amount,
  }
  if ('amount' in message) {
    if (typeof message.amount === 'object') {
      if ('denom' in message.amount && 'amount' in message.amount) {
        adjustedData.amount = message.amount?.amount
      } else {
        adjustedData.amount = message.amount[0]?.amount
      }
    }
  } else {
    const amount = tx.result.events
      .find((item) =>
        adjustedData.type.toLowerCase().includes(item.type.split('_')[0])
      )
      ?.attributes.map((item) => new TextDecoder().decode(item.value))
    adjustedData.amount = amount
      ?.find((item) => item.includes('loki'))
      ?.split('loki')[0]
  }
  if ('voter' in message) {
    adjustedData.sender = message?.voter
  }
  if (adjustedData.type === 'Delegate') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message?.validatorAddress
    }
  }
  if (adjustedData.type === 'Undelegate') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = ''
    }
  }
  if (adjustedData.type === 'Send') {
    if ('fromAddress' in message) {
      adjustedData.sender = message?.fromAddress
    }
    if ('toAddress' in message) {
      adjustedData.receiver = message?.toAddress
    }
  }
  if (adjustedData.type === 'Withdraw') {
    if ('sender' in message) {
      adjustedData.sender = message?.sender
    }
    if ('receiver' in message) {
      adjustedData.receiver = message?.receiver
    }
  }
  if (adjustedData.type === 'Withdraw delegator reward') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message?.validatorAddress
    }
  }
  if (adjustedData.type === 'Withdraw validator commission') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message?.validatorAddress
    }
  }
  if (adjustedData.type === 'Edit OracleScript') {
    if ('sender' in message) {
      adjustedData.sender = message.sender
    }
  }
  if (adjustedData.type === 'Edit Data Source') {
    if ('sender' in message) {
      adjustedData.sender = message.sender
    }
  }
  if (adjustedData.type === 'Edit Validator') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message.validatorAddress
    }
  }
  if (adjustedData.type === 'Begin Redelegate') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message.delegatorAddress
    }
    if ('validatorDstAddress' in message) {
      adjustedData.receiver = message.validatorDstAddress
    }
  }
  if (adjustedData.type === 'IBC Transfer') {
    if ('sender' in message) {
      adjustedData.sender = message.sender
    }
    if ('receiver' in message) {
      adjustedData.receiver = message.receiver
    }
  }
  if (adjustedData.type === 'Create Validator') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message.validatorAddress
    }
  }
  if (adjustedData.type === 'Submit Proposal') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message.validatorAddress
    }
  }
  if (adjustedData.type === 'Report Data') {
    if ('reporter' in message) {
      adjustedData.sender = message.reporter
    }
    if ('validator' in message) {
      adjustedData.receiver = message.validator
    }
  }
  if (adjustedData.type === 'Request Data') {
    if ('sender' in message) {
      adjustedData.sender = message.sender
    }
    if ('validator' in message) {
      adjustedData.receiver = message.validator
    }
  }
  if (adjustedData.type === 'Update IBC Client') {
    if ('signer' in message) {
      adjustedData.sender = message.signer
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message.validatorAddress
    }
  }
  if (adjustedData.type === 'Create Oracle Script') {
    if ('sender' in message) {
      adjustedData.sender = message.sender
    }
  }
  if (adjustedData.type === 'Create Data Source') {
    if ('sender' in message) {
      adjustedData.sender = message.sender
    }
  }
  if (adjustedData.type === 'Create IBC Client') {
    if ('signer' in message) {
      adjustedData.sender = message.signer
    }
  }
  if (adjustedData.type === 'Connection Open Init') {
    if ('signer' in message) {
      adjustedData.sender = message.signer
    }
  }
  if (adjustedData.type === 'Create Vesting Account') {
    if ('fromAddress' in message) {
      adjustedData.sender = message.fromAddress
    }
    if ('toAddress' in message) {
      adjustedData.receiver = message.toAddress
    }
  }
  if (adjustedData.type === 'Unjail') {
    if ('validatorAddr' in message) {
      adjustedData.receiver = message.validatorAddr
    }
  }
  if (adjustedData.type === 'Chanel Open Init') {
    if ('signer' in message) {
      adjustedData.sender = message.signer
    }
  }
  if (adjustedData.type === 'Activate') {
    if ('validator' in message) {
      adjustedData.receiver = message.validator
    }
  }
  if (adjustedData.type === 'Deposit') {
    if ('depositor' in message) {
      adjustedData.receiver = message.depositor
    }
  }

  console.debug(adjustedData.type)

  return adjustedData
}
