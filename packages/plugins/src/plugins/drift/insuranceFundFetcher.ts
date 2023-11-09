import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { DriftProgram, platformId, prefixSpotMarkets } from './constants';
import { SpotMarketEnhanced } from './types';
import { getUserInsuranceFundStakeAccountPublicKey } from './helpers';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { insuranceFundStakeStruct } from './struct';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const spotMarkets = await cache.getAllItems<SpotMarketEnhanced>({
    prefix: prefixSpotMarkets,
    networkId: NetworkId.solana,
  });

  const insuranceFundStakeAccountsAddresses: PublicKey[] = [];
  const mints: string[] = [];

  spotMarkets.forEach((sM) => {
    insuranceFundStakeAccountsAddresses.push(
      getUserInsuranceFundStakeAccountPublicKey(
        DriftProgram,
        new PublicKey(owner),
        sM.marketIndex
      )
    );
    mints.push(sM.mint.toString());
  });

  const tokensPrices = await cache.getTokenPrices(mints, NetworkId.solana);

  const insuranceAccounts = await getParsedMultipleAccountsInfo(
    client,
    insuranceFundStakeStruct,
    insuranceFundStakeAccountsAddresses
  );

  const assets: PortfolioAsset[] = [];
  insuranceAccounts.forEach((account, i) => {
    if (!account || !tokensPrices[i]) return;
    const tokenPrice = tokensPrices[i];
    if (!tokenPrice) return;
    assets.push(
      tokenPriceToAssetToken(
        mints[i],
        account.costBasis.dividedBy(10 ** tokenPrice.decimals).toNumber(),
        NetworkId.solana,
        tokenPrice
      )
    );
  });

  const elements: PortfolioElement[] = [];
  elements.push({
    networkId: NetworkId.ethereum,
    label: 'Staked',
    name: 'Insurance Fund',
    platformId,
    type: PortfolioElementType.multiple,
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-insurance-fund`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
