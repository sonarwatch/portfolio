import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { acsDecimals, acsMint, platformId, stakePid } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeAccountStruct } from './structs';
import { stakeAccountStructFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    stakeAccountStruct,
    stakePid,
    stakeAccountStructFilter(owner)
  );
  if (accounts.length === 0) return [];

  const acsTokenPrice = await cache.getTokenPrice(acsMint, NetworkId.solana);
  const assets: PortfolioAsset[] = [];
  for (const account of accounts) {
    if (account.stakeAmount.isZero()) continue;
    assets.push({
      ...tokenPriceToAssetToken(
        acsMint,
        account.stakeAmount.dividedBy(10 ** acsDecimals).toNumber(),
        NetworkId.solana,
        acsTokenPrice
      ),
      attributes: {},
      link: `https://hub.accessprotocol.co/en/creators/${account.stakePool.toString()}`,
      ref: account.pubkey.toString(),
    });
  }

  if (assets.length === 0) return [];
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
