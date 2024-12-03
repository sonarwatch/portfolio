import { BcsReader } from '@mysten/bcs';
import { Transaction } from '@mysten/sui/transactions';
import BigNumber from 'bignumber.js';
import { SuiClient } from '../../../utils/clients/types';
import { MODULE_CLOB, PACKAGE_ID } from './constants';
import { PoolSummary } from '../types';
import { normalizeSuiAddress, normalizeSuiObjectId } from '../helpers';
import { UserPosition } from './types';

const DUMMY_ADDRESS = normalizeSuiAddress('0x0');

const checkAccountCap = (accountCap: string): string => {
  if (accountCap === undefined) {
    throw new Error(
      'accountCap is undefined, please call setAccountCap() first'
    );
  }
  return normalizeSuiObjectId(accountCap);
};

export const getUserPosition = async (
  pool: PoolSummary,
  accountCap: string,
  suiClient: SuiClient
): Promise<UserPosition> => {
  const tx = new Transaction();
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
