import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  getUsdValueSum,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { nativeStakePlatform, platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { stakeAccountsFilter } from './filters';
import { stakeAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { marinadePlatform } from '../../marinade/constants';
import { marinadeManagerAddresses, stakeProgramId } from './constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const filters = stakeAccountsFilter(owner.toString());

  const stakeAccounts = await getParsedProgramAccounts(
    client,
    stakeAccountStruct,
    stakeProgramId,
    filters
  );
  if (stakeAccounts.length === 0) return [];

  const solTokenPrice = await cache.getTokenPrice(
    solanaNetwork.native.address,
    NetworkId.solana
  );
  if (!solTokenPrice) return [];

  let marinadeNativeAmount = 0;
  let nMarinadeAccounts = 0;
  const nativeAssets: PortfolioAsset[] = [];
  for (let i = 0; i < stakeAccounts.length; i += 1) {
    const stakeAccount = stakeAccounts[i];
    if (stakeAccount.stake.isZero()) continue;

    const amount = new BigNumber(stakeAccount.stake)
      .dividedBy(new BigNumber(10 ** 9))
      .toNumber();

    const isMarinade = marinadeManagerAddresses.includes(
      stakeAccount.staker.toString()
    );
    if (isMarinade) {
      marinadeNativeAmount += amount;
      nMarinadeAccounts += 1;
      continue;
    }

    nativeAssets.push({
      ...tokenPriceToAssetToken(
        solanaNetwork.native.address,
        amount,
        NetworkId.solana,
        solTokenPrice
      ),
      attributes: {
        unbondingPeriod: '1 epoch',
      },
    });
  }

  const elements: PortfolioElement[] = [];
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
  if (nMarinadeAccounts !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId: marinadePlatform.id,
      type: 'single',
      label: 'Staked',
      name: `Native (${nMarinadeAccounts} validators)`,
      value: marinadeNativeAmount * solTokenPrice.price,
      data: {
        asset: {
          ...tokenPriceToAssetToken(
            solanaNetwork.native.address,
            marinadeNativeAmount,
            NetworkId.solana,
            solTokenPrice
          ),
          attributes: {
            unbondingPeriod: '1 epoch',
          },
        },
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
