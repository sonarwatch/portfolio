import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementMultiple,
  PortfolioElementType,
  TokenPrice,
  formatMoveTokenAddress,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../../../platforms';
import { getClientSui } from '../../../utils/clients';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { platformId } from '../constants';
import runInBatch from '../../../utils/misc/runInBatch';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const coinsBalances = await client.getAllBalances({ owner });
  const coinsTypes = [...new Set(coinsBalances.map((cb) => cb.coinType))];
  const results = await runInBatch(
    coinsTypes.map(
      (coinType) => () => cache.getTokenPrice(coinType, NetworkId.sui)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  results.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });
  const walletTokensAssets: PortfolioAssetToken[] = [];

  for (let i = 0; i < coinsBalances.length; i++) {
    const coinBalance = coinsBalances[i];
    const amountRaw = Number(coinBalance.totalBalance);
    if (amountRaw === 0) continue;

    const { coinType } = coinBalance;
    const tokenPrice = tokenPrices.get(formatMoveTokenAddress(coinType));
    if (!tokenPrice) continue;

    const amount = amountRaw / 10 ** tokenPrice.decimals;

    walletTokensAssets.push(
      tokenPriceToAssetToken(coinType, amount, NetworkId.sui, tokenPrice)
    );
  }

  if (walletTokensAssets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.sui,
    platformId,
    label: 'Wallet',
    value: getUsdValueSum(walletTokensAssets.map((a) => a.value)),
    data: {
      assets: walletTokensAssets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-sui`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
