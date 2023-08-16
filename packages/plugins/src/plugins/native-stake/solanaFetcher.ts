import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  getUsdValueSum,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  marinadeNativeManager,
  marinadeNativeMerger,
  platformId,
} from './constants';
import { stakeAccountsFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { nativeStakePlatform } from '../../platforms';

const stakeProgramId = new PublicKey(
  'Stake11111111111111111111111111111111111111'
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const filters = stakeAccountsFilter(owner.toString());

  const programAccounts = await getParsedProgramAccounts(
    client,
    stakeAccountStruct,
    stakeProgramId,
    filters
  );
  if (programAccounts.length === 0) return [];

  const solTokenPrice = await cache.getTokenPrice(
    solanaNetwork.native.address,
    NetworkId.solana
  );
  if (!solTokenPrice) return [];

  const elements: PortfolioElement[] = [];
  const nativeAssets: PortfolioAsset[] = [];
  const marinadeNativeAssets: PortfolioAsset[] = [];
  for (let i = 0; i < programAccounts.length; i += 1) {
    const stakeAccount = programAccounts[i];
    const amount = new BigNumber(stakeAccount.stake)
      .dividedBy(new BigNumber(10 ** 9))
      .toNumber();
    if (amount === 0) continue;

    const stakedAsset = tokenPriceToAssetToken(
      solanaNetwork.native.address,
      amount,
      NetworkId.solana,
      solTokenPrice
    );
    if (
      stakeAccount.staker === marinadeNativeManager ||
      stakeAccount.staker === marinadeNativeMerger
    ) {
      marinadeNativeAssets.push(stakedAsset);
    } else {
      nativeAssets.push(stakedAsset);
    }
  }

  if (nativeAssets.length !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId: nativeStakePlatform.id,
      type: 'multiple',
      label: 'Staked',
      value: getUsdValueSum(nativeAssets.map((a) => a.value)),
      data: {
        assets: nativeAssets,
      },
    });
  }
  if (marinadeNativeAssets.length !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId: nativeStakePlatform.id,
      type: 'multiple',
      label: 'Staked',
      tags: ['Marinade Native'],
      value: getUsdValueSum(marinadeNativeAssets.map((a) => a.value)),
      data: {
        assets: marinadeNativeAssets,
      },
    });
  }
  return elements;
};
const fetcher: Fetcher = {
  id: `${platformId}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
