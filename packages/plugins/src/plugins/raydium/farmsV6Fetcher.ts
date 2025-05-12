import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { farmProgramIdV6 } from './farmsV6Job';
import {
  FarmAccountV6,
  UserFarmAccountV61,
  userFarmAccountV61Struct,
} from './structs/farms';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { LiquidityParams } from '../../utils/elementbuilder/Params';
import { userFarmAccountV61Filters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userFarmAccounts = await getParsedProgramAccounts(
    client,
    userFarmAccountV61Struct,
    farmProgramIdV6,
    userFarmAccountV61Filters(owner)
  );
  if (userFarmAccounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (let i = 0; i < userFarmAccounts.length; i += 1) {
    const userFarmAccount: ParsedAccount<UserFarmAccountV61> =
      userFarmAccounts[i];

    const farm = await cache.getItem<ParsedAccount<FarmAccountV6>>(
      userFarmAccount.id.toString(),
      {
        prefix: `${platformId}/farm-v6`,
        networkId: NetworkId.solana,
      }
    );

    if (!farm) continue;

    const element = elementRegistry.addElementLiquidity({
      label: 'Farming',
    });

    const liquidityParams: LiquidityParams = {
      ref: userFarmAccount.pubkey,
      sourceRefs: [{ name: 'Farm', address: userFarmAccount.id.toString() }],
      link: 'https://raydium.io/portfolio/?position_tab=standard',
    };

    const liquidity = element.addLiquidity(liquidityParams);

    if (farm.rewardInfos.length) {
      for (const rewardInfo of farm.rewardInfos) {
        if (
          rewardInfo.rewardMint.toString() ===
          '11111111111111111111111111111111'
        )
          continue;
        const i1 = farm.rewardInfos.indexOf(rewardInfo);
        liquidity.addRewardAsset({
          address: rewardInfo.rewardMint,
          amount: userFarmAccount.deposited
            .div(1e15)
            .times(rewardInfo.accRewardPerShare)
            .minus(userFarmAccount.rewardDebts[i1]),
        });
      }
    }

    // LP staked on Farm
    liquidity.addAsset({
      address: farm.lpMint,
      amount: userFarmAccount.deposited,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-farms-v6`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
