import {
  NetworkId,
  PortfolioAsset,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { dcaStruct } from './struct';
import { dcaProgramId } from './constants';
import { jupiterDCAFilter } from './filters';
import getTokenPricesMap from '../../../utils/misc/getTokensPricesMap';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { jupiterPlatform } from '../../jupiter/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    dcaStruct,
    dcaProgramId,
    jupiterDCAFilter(owner)
  );

  if (accounts.length === 0) return [];

  const amountByToken: Map<string, BigNumber> = new Map();

  for (const account of accounts) {
    const inputMint = account.inputMint.toString();
    const lastAmount = amountByToken.get(inputMint);
    const amountToAdd = account.inDeposited.minus(account.inUsed);
    if (!lastAmount) {
      amountByToken.set(inputMint, amountToAdd);
    } else {
      const newAmount = lastAmount.plus(amountToAdd);
      amountByToken.set(inputMint, newAmount);
    }
  }

  const tokenPriceById = await getTokenPricesMap(
    Array.from(amountByToken.keys()),
    NetworkId.solana,
    cache
  );

  const assets: PortfolioAsset[] = [];
  for (const token of amountByToken.keys()) {
    const tokenPrice = tokenPriceById.get(token);
    if (!tokenPrice) continue;
    const amount = amountByToken.get(token);
    if (!amount) continue;
    const asset = tokenPriceToAssetToken(
      tokenPrice.address,
      amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
      NetworkId.solana,
      tokenPrice
    );
    assets.push(asset);
  }
  return [
    {
      type: 'multiple',
      networkId: NetworkId.solana,
      platformId: jupiterPlatform.id,
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      label: 'Deposit',
      name: `DCA Orders (${accounts.length})`,
      data: { assets },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-jupiter-dca`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
