import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, rayDecimals, rayMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { stakeStruct } from './structs/staking';
import { getStakePubKey } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const rayFactor = new BigNumber(10 ** rayDecimals);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const stakeAccountPubKey = getStakePubKey(owner);
  const stakeAccount = await getParsedAccountInfo(
    client,
    stakeStruct,
    stakeAccountPubKey
  );

  if (!stakeAccount || stakeAccount.depositBalance.isZero()) return [];

  const tokenPrice = await cache.getTokenPrice(rayMint, NetworkId.solana);
  const asset = tokenPriceToAssetToken(
    rayMint,
    stakeAccount.depositBalance.dividedBy(rayFactor).toNumber(),
    NetworkId.solana,
    tokenPrice
  );

  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.multiple,
      label: 'Staked',
      value: asset.value,
      data: {
        assets: [asset],
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
