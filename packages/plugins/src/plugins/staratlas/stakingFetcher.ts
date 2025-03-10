import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { atlasDecimals, atlasMint, platformId, stakingPid } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakingStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    stakingStruct,
    stakingPid,
    [
      { dataSize: stakingStruct.byteSize },
      {
        memcmp: { bytes: owner, offset: 8 },
      },
    ]
  );
  if (accounts.length === 0) return [];

  const atlasTokenPrice = await cache.getTokenPrice(
    atlasMint,
    NetworkId.solana
  );
  const assets: PortfolioAssetToken[] = [];
  accounts.forEach((account) => {
    if (account.totalStake.isZero()) return;

    const asset = tokenPriceToAssetToken(
      atlasMint,
      account.totalStake.div(10 ** atlasDecimals).toNumber(),
      NetworkId.solana,
      atlasTokenPrice
    );
    if (!account.pendingRewards.isZero()) {
      asset.attributes = { isClaimable: true };
    }

    assets.push({ ...asset, ref: account.pubkey.toString() });
  });

  if (assets.length === 0) return [];
  return [
    {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      label: 'Staked',
      platformId,
      data: {
        assets,
        link: 'https://govern.staratlas.com/lockers/atlas',
      },
      value: getUsdValueSum(assets.map((a) => a.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
