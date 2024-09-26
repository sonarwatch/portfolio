import { BcsReader, splitGenericParameters } from '@mysten/bcs';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import BigNumber from 'bignumber.js';
import { SuiClient } from '../../utils/clients/types';
import { MODULE_CLOB, PACKAGE_ID } from './constants';
import { PoolSummary, UserPosition } from './types';
import { queryEventsSafe } from '../../utils/sui/queryEventsSafe';

const SUI_ADDRESS_LENGTH = 32;
const DUMMY_ADDRESS = normalizeSuiAddress('0x0');

type StructTag = {
  address: string;
  module: string;
  name: string;
  typeParams: (string | StructTag)[];
};

function normalizeSuiAddress(value: string, forceAdd0x = false): string {
  let address = value.toLowerCase();
  if (!forceAdd0x && address.startsWith('0x')) {
    address = address.slice(2);
  }
  return `0x${address.padStart(SUI_ADDRESS_LENGTH * 2, '0')}`;
}

function normalizeSuiObjectId(value: string, forceAdd0x = false): string {
  return normalizeSuiAddress(value, forceAdd0x);
}

function parseTypeTag(type: string): string | StructTag {
  if (!type.includes('::')) return type;

  return parseStructTag(type);
}

function parseStructTag(type: string): StructTag {
  const [address, module] = type.split('::');

  const rest = type.slice(address.length + module.length + 4);
  const name = rest.includes('<') ? rest.slice(0, rest.indexOf('<')) : rest;
  const typeParams = rest.includes('<')
    ? splitGenericParameters(
        rest.slice(rest.indexOf('<') + 1, rest.lastIndexOf('>'))
      ).map((typeParam) => parseTypeTag(typeParam.trim()))
    : [];

  return {
    address: normalizeSuiAddress(address),
    module,
    name,
    typeParams,
  };
}

function normalizeStructTag(type: string | StructTag): string {
  const { address, module, name, typeParams } =
    typeof type === 'string' ? parseStructTag(type) : type;

  const formattedTypeParams =
    typeParams?.length > 0
      ? `<${typeParams
          .map((typeParam) =>
            typeof typeParam === 'string'
              ? typeParam
              : normalizeStructTag(typeParam)
          )
          .join(',')}>`
      : '';

  return `${address}::${module}::${name}${formattedTypeParams}`;
}

const checkAccountCap = (accountCap: string): string => {
  if (accountCap === undefined) {
    throw new Error(
      'accountCap is undefined, please call setAccountCap() first'
    );
  }
  return normalizeSuiObjectId(accountCap);
};

/* const BcsOrder = bcs.struct('Order', {
  orderId: bcs.u64(),
  clientOrderId: bcs.u64(),
  price: bcs.u64(),
  originalQuantity: bcs.u64(),
  quantity: bcs.u64(),
  isBid: bcs.bool(),
  owner: bcs.bytes(32),
  expireTimestamp: bcs.u64(),
  selfMatchingPrevention: bcs.u8(),
});

export const listOpenOrders = async (
  pool: PoolSummary,
  accountCap: string,
  suiClient: SuiClient
): Promise<Order[]> => {
  const tx = new TransactionBlock();
  const cap = checkAccountCap(accountCap);

  tx.moveCall({
    typeArguments: [pool.baseAsset, pool.quoteAsset],
    target: `${PACKAGE_ID}::${MODULE_CLOB}::list_open_orders`,
    arguments: [tx.object(pool.poolId), tx.object(cap)],
  });

  const { results } = await suiClient.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: DUMMY_ADDRESS,
  });

  if (!results) {
    return [];
  }

  return bcs
    .vector(BcsOrder)
    .parse(Uint8Array.from(results![0].returnValues![0][0]));
}; */

export const getUserPosition = async (
  pool: PoolSummary,
  accountCap: string,
  suiClient: SuiClient
): Promise<UserPosition> => {
  const tx = new TransactionBlock();
  const cap = checkAccountCap(accountCap);

  tx.moveCall({
    typeArguments: [pool.baseAsset, pool.quoteAsset],
    target: `${PACKAGE_ID}::${MODULE_CLOB}::account_balance`,
    arguments: [tx.object(normalizeSuiObjectId(pool.poolId)), tx.object(cap)],
  });
  const [
    availableBaseAmount,
    lockedBaseAmount,
    availableQuoteAmount,
    lockedQuoteAmount,
  ] = (
    await suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: DUMMY_ADDRESS,
    })
  ).results?.[0].returnValues?.map(
    ([bytes]) => new BigNumber(new BcsReader(Uint8Array.from(bytes)).read64())
  ) as BigNumber[];

  return {
    availableBaseAmount,
    lockedBaseAmount,
    availableQuoteAmount,
    lockedQuoteAmount,
  };
};

export const getAllPools = async (
  suiClient: SuiClient
): Promise<PoolSummary[]> => {
  const events = await queryEventsSafe<{
    pool_id: string;
    base_asset: { name: string };
    quote_asset: { name: string };
  }>(suiClient, {
    MoveEventType: `${PACKAGE_ID}::${MODULE_CLOB}::PoolCreated`,
  });

  return events
    .map(
      (e) =>
        e.parsedJson && {
          poolId: e.parsedJson.pool_id as string,
          baseAsset: normalizeStructTag(e.parsedJson.base_asset.name),
          quoteAsset: normalizeStructTag(e.parsedJson.quote_asset.name),
        }
    )
    .filter((p) => p !== null) as PoolSummary[];
};
