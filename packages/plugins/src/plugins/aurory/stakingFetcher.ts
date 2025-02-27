import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { decimals, platformId, xAuryMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getStakingAccountAddress } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { UserStakingAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const stakingAccount = await getParsedAccountInfo(
    client,
    UserStakingAccountStruct,
    getStakingAccountAddress(owner)
  );

  if (!stakingAccount || stakingAccount.amount.isZero()) return [];

  const tokenPrice = await cache.getTokenPrice(xAuryMint, NetworkId.solana);

  const asset: PortfolioAsset = tokenPriceToAssetToken(
    xAuryMint,
    stakingAccount.amount.dividedBy(10 ** decimals).toNumber(),
    NetworkId.solana,
    tokenPrice
  );
  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: {
        assets: [asset],
        ref: stakingAccount.pubkey.toString(),
        link: 'https://app.aurory.io/staking',
      },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
