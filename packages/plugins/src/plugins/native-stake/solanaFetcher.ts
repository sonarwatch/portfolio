import {
  NetworkId,
  PortfolioElement,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { stakeAccountsFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

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

  for (let i = 0; i < programAccounts.length; i += 1) {
    const stakeAccount = programAccounts[i];
    const amount = new BigNumber(stakeAccount.stake)
      .dividedBy(new BigNumber(10 ** 9))
      .toNumber();
    const value = amount * solTokenPrice.price;
    const { voter } = stakeAccount;

    const stakedAsset = tokenPriceToAssetToken(
      solanaNetwork.native.address,
      amount,
      NetworkId.solana,
      solTokenPrice
    );
    elements.push({
      networkId: NetworkId.solana,
      platformId,
      type: 'multiple',
      label: 'Staked',
      tags: ['Native Stake'],
      name: voter.toString(),
      value,
      data: {
        assets: [stakedAsset],
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
