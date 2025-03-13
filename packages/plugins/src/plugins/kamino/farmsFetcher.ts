import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { farmProgramId, farmsKey, kmnoMint, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { userStateStruct } from './structs/vaults';
import { userStateFilter } from './filters';
import { FarmInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userStates = await getParsedProgramAccounts(
    client,
    userStateStruct,
    farmProgramId,
    userStateFilter(owner)
  );
  if (!userStates) return [];

  const farmsInfo = await cache.getItem<FarmInfo[]>(farmsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!farmsInfo) throw new Error('Farms not cached.');

  const farmsById = arrayToMap(farmsInfo, 'pubkey');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementLiquidity({
    label: 'Farming',
  });

  for (const userState of userStates) {
    if (userState.activeStakeScaled.isZero()) continue;

    const farm = farmsById.get(userState.farmState.toString());
    if (!farm) continue;

    const amount = userState.activeStakeScaled.dividedBy(10 ** 18).toNumber();

    // Handle specific KMNO Staking which uses a farm
    if (farm.mint.toString() === kmnoMint) {
      const stakedElement = elementRegistry.addElementMultiple({
        label: 'Staked',
        ref: userState.pubkey.toString(),
        sourceRefs: [
          { name: 'Farm', address: userState.farmState.toString() },
          { name: 'Strategy', address: farm.strategyId?.toString() },
        ],
        link: 'https://app.kamino.finance/governance-and-staking',
      });
      stakedElement.addAsset({
        address: farm.mint,
        amount,
      });
    } else {
      const liquidity = element.addLiquidity({
        ref: userState.pubkey.toString(),
        sourceRefs: [
          { name: 'Farm', address: userState.farmState.toString() },
          { name: 'Strategy', address: farm.strategyId?.toString() },
        ],
        link: `https://app.kamino.finance/liquidity/${farm.strategyId?.toString()}`,
      });
      liquidity.addAsset({
        address: farm.mint,
        amount,
      });
    }

    // for (let i = 0; i < farm.rewardsMints.length; i++) {
    //   const rewardMint = farm.rewardsMints[i];
    //   if (rewardMint === '11111111111111111111111111111111') continue;

    //   const rewardAmountRaw = userState.rewardsIssuedUnclaimed[i].plus(
    //     userState.rewardsTallyScaled[i]
    //   );
    //   console.log(
    //     'constexecutor:FetcherExecutor= ~ userState.rewardsIssuedUnclaimed[i]:',
    //     userState.rewardsIssuedUnclaimed[i].toNumber()
    //   );
    //   console.log(
    //     'constexecutor:FetcherExecutor= ~ userState.rewardsTallyScaled[i]:',
    //     userState.rewardsTallyScaled[i].toNumber()
    //   );
    //   if (rewardAmountRaw.isZero()) continue;

    //   const rewardPrice = tokenPriceById.get(rewardMint);
    //   if (!rewardPrice) continue;

    //   const rewardAmount = rewardAmountRaw
    //     .dividedBy(10 ** 18)
    //     .dividedBy(10 ** rewardPrice.decimals)
    //     .toNumber();
    //   rewardAssets.push({
    //     ...tokenPriceToAssetToken(
    //       rewardMint,
    //       rewardAmount,
    //       NetworkId.solana,
    //       rewardPrice
    //     ),
    //     attributes: { isClaimable: false },
    //   });
    // }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
