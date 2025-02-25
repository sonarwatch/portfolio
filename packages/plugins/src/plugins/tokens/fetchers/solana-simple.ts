import {
  getUsdValueSum,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';

import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { solanaToken2022PidPk, solanaTokenPidPk } from '../../../utils/solana';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = await getClientSolana();

  const promises = [
    client.getParsedTokenAccountsByOwner(new PublicKey(owner), {
      programId: solanaTokenPidPk,
    }),
    client.getParsedTokenAccountsByOwner(new PublicKey(owner), {
      programId: solanaToken2022PidPk,
    }),
  ];
  const res = await Promise.all(promises);
  const accounts = [...res[0].value, ...res[1].value].filter(
    (acc) =>
      acc.account.data.parsed.info.tokenAmount.decimals !== 0 &&
      acc.account.data.parsed.info.tokenAmount.uiAmount !== 0
  );

  const tokenPrices = await cache.getTokenPricesAsMap(
    accounts.map((a) => a.account.data.parsed.info.mint),
    NetworkId.solana
  );

  const tokenAssets: PortfolioAssetToken[] = [];
  accounts.forEach((acc) => {
    const { mint, tokenAmount } = acc.account.data.parsed.info;
    const { uiAmount: amount, decimals } = tokenAmount;
    if (decimals === 0) return;

    const tokenPrice = tokenPrices.get(mint);

    if (tokenPrice && tokenPrice.platformId !== walletTokensPlatform.id) return;

    tokenAssets.push({
      ...tokenPriceToAssetToken(mint, amount, NetworkId.solana, tokenPrice),
      ref: acc.pubkey.toString(),
      link: tokenPrice?.link,
      sourceRefs: tokenPrice?.sourceRefs,
    });
  });

  if (tokenAssets.length === 0) return [];

  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.solana,
    platformId: walletTokensPlatform.id,
    label: 'Wallet',
    value: getUsdValueSum(tokenAssets.map((a) => a.value)),
    data: {
      assets: tokenAssets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana-simple`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
