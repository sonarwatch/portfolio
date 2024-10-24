import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { bankObjectId, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getObject } from '../../utils/sui/getObject';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { Bank, BankAccount } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { wUsdcSuiType } from '../../utils/sui/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [bank, tokenPrice] = await Promise.all([
    getObject<Bank>(client, bankObjectId),
    cache.getTokenPrice(formatMoveTokenAddress(wUsdcSuiType), NetworkId.sui),
  ]);

  if (!bank.data?.content?.fields.accounts.fields.id.id || !tokenPrice)
    return [];

  const account = await getDynamicFieldObject<BankAccount>(client, {
    parentId: bank.data?.content?.fields.accounts.fields.id.id,
    name: {
      type: 'address',
      value: owner,
    },
  });

  if (!account) return [];

  const assets: PortfolioAsset[] = [];

  if (
    account.data?.content?.fields.value.fields.balance &&
    account.data?.content?.fields.value.fields.balance !== '0'
  )
    assets.push(
      tokenPriceToAssetToken(
        wUsdcSuiType,
        new BigNumber(account.data?.content?.fields.value.fields.balance)
          .dividedBy(10 ** 9)
          .toNumber(),
        NetworkId.sui,
        tokenPrice
      )
    );

  if (assets.length === 0) return [];
  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.sui,
      name: 'Free Collateral',
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-bank`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
