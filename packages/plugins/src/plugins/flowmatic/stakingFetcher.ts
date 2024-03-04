import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { flowmaticMint, platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeDepositReceiptStruct } from '../bonkrewards/structs';
import { stakeFilters } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const stakeAccounts = await getParsedProgramAccounts(
    client,
    stakeDepositReceiptStruct,
    programId,
    stakeFilters(owner)
  );

  const tokenPrice = await cache.getTokenPrice(flowmaticMint, NetworkId.solana);
  const assets: PortfolioAsset[] = [];
  for (const stakeAccount of stakeAccounts) {
    const lockedUntil = new Date(
      stakeAccount.depositTimestamp
        .plus(stakeAccount.lockupDuration)
        .times(1000)
        .toNumber()
    ).getTime();

    assets.push({
      ...tokenPriceToAssetToken(
        flowmaticMint,
        stakeAccount.depositAmount.dividedBy(10 ** 4).toNumber(),
        NetworkId.solana,
        tokenPrice
      ),
      attributes: {
        lockedUntil,
      },
    });
  }
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
