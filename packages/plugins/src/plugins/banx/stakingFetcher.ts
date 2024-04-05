import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { banxApiUrl, banxDecimals, banxMint, platformId } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { BanxResponse } from './types';

const banxFactor = new BigNumber(10 ** banxDecimals);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // Account fetch was taking up to 1 min so better to use their API for now.

  // const client = getClientSolana();

  // const accounts = await getParsedProgramAccounts(
  //   client,
  //   banxTokenStakeStruct,
  //   banxPid,
  //   stakeFilters(owner)
  // );

  // const amounts: BigNumber[] = [];
  // for (const account of accounts) {
  //   if (account.banxStakeState === BanxTokenStakeState.Unstaked) continue;
  //   if (account.tokensStaked.isZero()) continue;

  //   amounts.push(account.tokensStaked.dividedBy(banxFactor));
  // }

  // if (amounts.length === 0) return [];

  const banxRes: AxiosResponse<BanxResponse> | null = await axios
    .get(banxApiUrl + owner)
    .catch(() => null);
  if (!banxRes) return [];

  const amount = new BigNumber(
    banxRes.data.data.banxTokenStake.tokensStaked
  ).dividedBy(banxFactor);
  if (amount.isZero()) return [];

  const tokenPrice = await cache.getTokenPrice(banxMint, NetworkId.solana);
  const assets: PortfolioAsset[] = [
    tokenPriceToAssetToken(
      banxMint,
      amount.toNumber(),
      NetworkId.solana,
      tokenPrice
    ),
  ];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
