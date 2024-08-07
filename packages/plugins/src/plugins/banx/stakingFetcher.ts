import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { banxDecimals, banxMint, banxPid, platformId } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getParsedProgramAccounts } from '../../utils/solana';
import { BanxTokenStakeState, banxTokenStakeStruct } from './structs';
import { stakeFilters } from './filters';
import { getClientSolana } from '../../utils/clients';

const banxFactor = new BigNumber(10 ** banxDecimals);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    banxTokenStakeStruct,
    banxPid,
    stakeFilters(owner)
  );

  const amounts: BigNumber[] = [];
  for (const account of accounts) {
    if (account.banxStakeState === BanxTokenStakeState.Unstaked) continue;
    if (account.tokensStaked.isZero()) continue;

    amounts.push(account.tokensStaked.dividedBy(banxFactor));
  }
  if (amounts.length === 0) return [];

  const amount = amounts.reduce((curr, sum) => curr.plus(sum), BigNumber(0));

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
