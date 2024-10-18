/* eslint-disable no-param-reassign */

import Decimal from 'decimal.js';
import BigNumber from 'bignumber.js';
import { suiClockAddress, suiNetwork } from '@sonarwatch/portfolio-core';
import { normalizeSuiObjectId } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import {
  ClmmPositionStatus,
  CollectFeesQuote,
  FetchPosFeeParams,
  FetchPosRewardParams,
  NFT,
  Pool,
  Position,
  PosRewarderResult,
  Rewarder,
  SuiAddressType,
  SuiStructTag,
} from './types';
import { ObjectResponse } from '../../utils/sui/types';
import { getObjectDeletedResponse } from '../../utils/sui/getObjectDeletedResponse';
import { getObjectNotExistsResponse } from '../../utils/sui/getObjectNotExistsResponse';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { getClientSui } from '../../utils/clients';

export function fromX64(num: BigNumber): Decimal {
  return new Decimal(num.toString()).mul(Decimal.pow(2, -64));
}

export function composeType(
  address: string,
  generics: SuiAddressType[]
): SuiAddressType;
export function composeType(
  address: string,
  struct: string,
  generics?: SuiAddressType[]
): SuiAddressType;
export function composeType(
  address: string,
  module: string,
  struct: string,
  generics?: SuiAddressType[]
): SuiAddressType;
export function composeType(
  address: string,
  ...args: unknown[]
): SuiAddressType {
  const generics: string[] = Array.isArray(args[args.length - 1])
    ? (args.pop() as string[])
    : [];
  const chains = [address, ...args].filter(Boolean);

  let result: string = chains.join('::');

  if (generics && generics.length) {
    result += `<${generics.join(', ')}>`;
  }

  return result;
}

export function extractStructTagFromType(type: string): SuiStructTag {
  try {
    let newType = type.replace(/\s/g, '');

    const genericsString = newType.match(/(<.+>)$/);
    const generics = genericsString?.[0]?.match(
      /(\w+::\w+::\w+)(?:<.*?>(?!>))?/g
    );
    if (generics) {
      newType = newType.slice(0, newType.indexOf('<'));
      const tag = extractStructTagFromType(newType);
      const structTag: SuiStructTag = {
        ...tag,
        type_arguments: generics.map(
          (item) => extractStructTagFromType(item).source_address
        ),
      };
      structTag.type_arguments = structTag.type_arguments.map((item) =>
        isSuiCoin(item) ? item : extractStructTagFromType(item).source_address
      );
      structTag.source_address = composeType(
        structTag.full_address,
        structTag.type_arguments
      );
      return structTag;
    }
    const parts = newType.split('::');

    const structTag: SuiStructTag = {
      full_address: newType,
      address: parts[2] === 'SUI' ? '0x2' : normalizeSuiObjectId(parts[0]),
      module: parts[1],
      name: parts[2],
      type_arguments: [],
      source_address: '',
    };
    structTag.full_address = `${structTag.address}::${structTag.module}::${structTag.name}`;
    structTag.source_address = composeType(
      structTag.full_address,
      structTag.type_arguments
    );
    return structTag;
  } catch (error) {
    return {
      full_address: type,
      address: '',
      module: '',
      name: '',
      type_arguments: [],
      source_address: type,
    };
  }
}

export function isSuiCoin(coinAddress: SuiAddressType) {
  return (
    extractStructTagFromType(coinAddress).full_address ===
    suiNetwork.native.address
  );
}

export function buildPoolName(
  coin_type_a: string,
  coin_type_b: string,
  tick_spacing: string
) {
  const coinNameA = extractStructTagFromType(coin_type_a).name;
  const coinNameB = extractStructTagFromType(coin_type_b).name;
  return `${coinNameA}-${coinNameB}[${tick_spacing}]`;
}

export function normalizeCoinType(coinType: string): string {
  return extractStructTagFromType(coinType).source_address;
}

export function asIntN(int: bigint, bits = 32) {
  return Number(BigInt.asIntN(bits, BigInt(int)));
}

export function getPoolFromObject(object: ObjectResponse<unknown>): Pool {
  if (!object.data || !object.data.content?.fields)
    throw Error('getPoolFromObject object.data is missing');
  const type = object.data?.type;
  const formatType = extractStructTagFromType(type);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = object.data.content.fields as any;
  const rewarders: Rewarder[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields.rewarder_manager.fields.rewarders.forEach((item: any) => {
    const { emissions_per_second: emissionsPerSecond } =
      item.fields.emissions_per_second;
    const emissionSeconds = fromX64(new BigNumber(emissionsPerSecond));
    const emissionsEveryDay = Math.floor(
      emissionSeconds.toNumber() * 60 * 60 * 24
    );

    rewarders.push({
      emissions_per_second: emissionsPerSecond,
      coinAddress: extractStructTagFromType(item.fields.reward_coin.fields.name)
        .source_address,
      growth_global: item.fields.growth_global,
      emissionsEveryDay,
    });
  });

  const name = buildPoolName(
    formatType.type_arguments[0],
    formatType.type_arguments[1],
    fields['tick_spacing']
  );
  return {
    poolAddress: object.data.objectId,
    poolType: type,
    coinTypeA: formatType.type_arguments[0],
    coinTypeB: formatType.type_arguments[1],
    coinAmountA: fields['coin_a'],
    coinAmountB: fields['coin_b'],
    current_sqrt_price: fields['current_sqrt_price'],
    current_tick_index: bitsToNumber(fields['current_tick_index'].fields.bits),
    fee_growth_global_a: fields['fee_growth_global_a'],
    fee_growth_global_b: fields['fee_growth_global_b'],
    fee_protocol_coin_a: fields['fee_protocol_coin_a'],
    fee_protocol_coin_b: fields['fee_protocol_coin_b'],
    fee_rate: fields['fee_rate'],
    is_pause: fields['is_pause'],
    liquidity: fields['liquidity'],
    position_manager: {
      positions_handle:
        fields['position_manager'].fields.positions.fields.id.id,
      size: fields['position_manager'].fields.positions.fields.size,
    },
    rewarder_infos: rewarders,
    rewarder_last_updated_time:
      fields['rewarder_manager'].fields.last_updated_time,
    tickSpacing: fields['tick_spacing'],
    ticks_handle: fields['tick_manager'].fields.ticks.fields.id.id,
    uri: fields['url'],
    index: Number(fields['index']),
    name,
  };
}

export function buildPosition(objects: ObjectResponse<unknown>): Position {
  let nft: NFT = {
    creator: '',
    description: '',
    image_url: '',
    link: '',
    name: '',
    project_url: '',
  };

  let position = {
    ...nft,
    pos_object_id: '',
    owner: '',
    type: '',
    coin_type_a: '',
    coin_type_b: '',
    liquidity: '',
    tick_lower_index: 0,
    tick_upper_index: 0,
    index: 0,
    pool: '',
    reward_amount_owed_0: '0',
    reward_amount_owed_1: '0',
    reward_amount_owed_2: '0',
    reward_growth_inside_0: '0',
    reward_growth_inside_1: '0',
    reward_growth_inside_2: '0',
    fee_growth_inside_a: '0',
    fee_owed_a: '0',
    fee_growth_inside_b: '0',
    fee_owed_b: '0',
    position_status: ClmmPositionStatus.Exists,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fields = objects.data?.content?.fields as any;
  if (fields) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { type } = objects.data!;
    const ownerWarp = objects.data?.owner as {
      AddressOwner: string;
    };

    if ('nft' in fields) {
      fields = fields['nft'].fields;
      nft.description = fields['description'];
      nft.name = fields['name'];
      nft.link = fields['url'];
    } else {
      nft = buildNFT(objects);
    }

    position = {
      ...nft,
      pos_object_id: fields['id'].id,
      owner: ownerWarp.AddressOwner,
      type,
      coin_type_a: fields['coin_type_a'].fields.name,
      coin_type_b: fields['coin_type_b'].fields.name,
      liquidity: fields['liquidity'],
      tick_lower_index: bitsToNumber(fields['tick_lower_index'].fields.bits),
      tick_upper_index: bitsToNumber(fields['tick_upper_index'].fields.bits),
      index: fields['index'],
      pool: fields['pool'],
      reward_amount_owed_0: '0',
      reward_amount_owed_1: '0',
      reward_amount_owed_2: '0',
      reward_growth_inside_0: '0',
      reward_growth_inside_1: '0',
      reward_growth_inside_2: '0',
      fee_growth_inside_a: '0',
      fee_owed_a: '0',
      fee_growth_inside_b: '0',
      fee_owed_b: '0',
      position_status: ClmmPositionStatus.Exists,
    };
  }

  const deletedResponse = getObjectDeletedResponse(objects);
  if (deletedResponse) {
    position.pos_object_id = deletedResponse.objectId;
    position.position_status = ClmmPositionStatus.Deleted;
  }
  const objectNotExistsResponse = getObjectNotExistsResponse(objects);
  if (objectNotExistsResponse) {
    position.pos_object_id = objectNotExistsResponse;
    position.position_status = ClmmPositionStatus.NotExists;
  }

  return position;
}

export function buildNFT(objects: ObjectResponse<unknown>): NFT {
  const fields = objects.data?.display?.data;
  const nft: NFT = {
    creator: '',
    description: '',
    image_url: '',
    link: '',
    name: '',
    project_url: '',
  };
  if (fields) {
    nft.creator = fields['creator'];
    nft.description = fields['description'];
    nft.image_url = fields['image_url'];
    nft.link = fields['link'];
    nft.name = fields['name'];
    nft.project_url = fields['project_url'];
  }
  return nft;
}

export const fetchPosFeeAmount = async (
  params: FetchPosFeeParams[]
): Promise<CollectFeesQuote[]> => {
  const tx = new Transaction();

  for (const paramItem of params) {
    const typeArguments = [paramItem.coinTypeA, paramItem.coinTypeB];
    const args = [
      tx.object(
        '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f'
      ),
      tx.object(paramItem.poolAddress),
      tx.pure.address(paramItem.positionId),
    ];
    tx.moveCall({
      target: `0x8faab90228e4c4df91c41626bbaefa19fc25c514405ac64de54578dec9e6f5ee::fetcher_script::fetch_position_fees`,
      arguments: args,
      typeArguments,
    });
  }

  const simulateRes = await getClientSui().devInspectTransactionBlock({
    transactionBlock: tx,
    sender: simulationAccount,
  });

  if (simulateRes.error != null) {
    throw new Error(
      `fetch position fee error code: ${
        simulateRes.error ?? 'unknown error'
      }, please check config and postion and pool object ids`
    );
  }

  const valueData: any = simulateRes.events?.filter(
    (item: any) =>
      extractStructTagFromType(item.type).name === `FetchPositionFeesEvent`
  );
  if (valueData.length === 0) {
    return [];
  }

  const result: CollectFeesQuote[] = [];

  for (let i = 0; i < valueData.length; i += 1) {
    const { parsedJson } = valueData[i];
    const posRrewarderResult: CollectFeesQuote = {
      feeOwedA: new BigNumber(parsedJson.fee_owned_a),
      feeOwedB: new BigNumber(parsedJson.fee_owned_b),
      position_id: parsedJson.position_id,
    };
    result.push(posRrewarderResult);
  }

  return result;
};

const simulationAccount =
  '0x326ce9894f08dcaa337fa232641cc34db957aec9ff6614c1186bc9a7508df0bb';

export const fetchPosRewardersAmount = async (
  params: FetchPosRewardParams[]
) => {
  const tx = new Transaction();

  for (const paramItem of params) {
    const typeArguments = [paramItem.coinTypeA, paramItem.coinTypeB];
    const args = [
      tx.object(
        '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f'
      ),
      tx.object(paramItem.poolAddress),
      tx.pure.address(paramItem.positionId),
      tx.object(suiClockAddress),
    ];
    tx.moveCall({
      target: `0x8faab90228e4c4df91c41626bbaefa19fc25c514405ac64de54578dec9e6f5ee::fetcher_script::fetch_position_rewards`,
      arguments: args,
      typeArguments,
    });
  }

  const simulateRes = await getClientSui().devInspectTransactionBlock({
    transactionBlock: tx,
    sender: simulationAccount,
  });

  if (simulateRes.error != null) {
    throw new Error(
      `fetch position rewards error code: ${
        simulateRes.error ?? 'unknown error'
      }, please check config and params`
    );
  }

  const valueData: any = simulateRes.events?.filter(
    (item: any) =>
      extractStructTagFromType(item.type).name === `FetchPositionRewardsEvent`
  );
  if (valueData.length === 0) {
    return [];
  }

  if (valueData.length !== params.length) {
    throw new Error('valueData.length !== params.pools.length');
  }

  const result: PosRewarderResult[] = [];

  for (let i = 0; i < valueData.length; i += 1) {
    const posRrewarderResult: PosRewarderResult = {
      poolAddress: params[i].poolAddress,
      positionId: params[i].positionId,
      rewarderAmountOwed: [],
    };

    for (let j = 0; j < params[i].rewarderInfo.length; j += 1) {
      posRrewarderResult.rewarderAmountOwed.push({
        amount_owed: new BigNumber(valueData[i].parsedJson.data[j]),
        coin_address: params[i].rewarderInfo[j].coinAddress,
      });
    }

    result.push(posRrewarderResult);
  }

  return result;
};
