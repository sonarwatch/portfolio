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
  marinadeNativeManagerAddresses,
  nativeStakePlatform,
  platformId,
} from './constants';
import { stakeAccountsFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { marinadePlatform } from '../marinade/constants';

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
  let marinadeNativeAmount = 0;
  let accounts = 0;
  for (let i = 0; i < programAccounts.length; i += 1) {
    const stakeAccount = programAccounts[i];
    const amount = new BigNumber(stakeAccount.stake)
      .dividedBy(new BigNumber(10 ** 9))
      .toNumber();
    if (amount === 0) continue;

    if (
      marinadeNativeManagerAddresses.includes(stakeAccount.staker.toString())
    ) {
      marinadeNativeAmount += amount;
      accounts += 1;
    } else {
      nativeAssets.push(
        tokenPriceToAssetToken(
          solanaNetwork.native.address,
          amount,
          NetworkId.solana,
          solTokenPrice
        )
      );
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
  if (marinadeNativeAmount !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId: marinadePlatform.id,
      type: 'single',
      label: 'Staked',
      name: `Native (${accounts} validators)`,
      value: marinadeNativeAmount * solTokenPrice.price,
      data: {
        asset: tokenPriceToAssetToken(
          solanaNetwork.native.address,
          marinadeNativeAmount,
          NetworkId.solana,
          solTokenPrice
        ),
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
