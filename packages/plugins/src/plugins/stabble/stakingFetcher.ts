import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { minerStruct, rewarderStruct, stakedPoolStruct } from './structs';
import { StakePoolInfo } from './types';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getRewards } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const minerAccounts = await ParsedGpa.build(
    connection,
    minerStruct,
    stakingPid
  )
    .addFilter('accountDiscriminator', [223, 113, 15, 54, 123, 122, 140, 100])
    .addFilter('beneficiary', new PublicKey(owner))
    .addDataSizeFilter(137)
    .run();
  if (minerAccounts.length === 0) return [];

  const poolsInfo = await cache.getItems<StakePoolInfo>(
    minerAccounts.map((miner) => miner.pool.toString()),
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  if (!poolsInfo) throw new Error('No poolsInfo found in cache');

  const [tokenPricesById, rewarderAccounts, stakePoolAccounts] =
    await Promise.all([
      cache.getTokenPricesAsMap(
        poolsInfo.map((pool) => (pool ? pool.mint : [])).flat(),
        NetworkId.solana
      ),
      getParsedMultipleAccountsInfo(
        connection,
        rewarderStruct,
        poolsInfo
          .map((pool) => (pool ? new PublicKey(pool.rewarder) : []))
          .flat()
      ),
      getParsedMultipleAccountsInfo(
        connection,
        stakedPoolStruct,
        poolsInfo
          .map((pool) => (pool ? new PublicKey(pool.address) : []))
          .flat()
      ),
    ]);

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementLiquidity({
    label: 'Farming',
  });

  for (let i = 0; i < minerAccounts.length; i += 1) {
    const mainMiner = minerAccounts[i];
    // If the beneficiary is not the authority, it means it's a derived miner for additional rewards
    if (mainMiner.beneficiary.toString() !== mainMiner.authority.toString())
      continue;

    const stakePool = stakePoolAccounts.find(
      (acc) => acc?.pubkey.toString() === mainMiner.pool.toString()
    );
    if (!stakePool) continue;

    const firstRewarder = rewarderAccounts.find(
      (acc) => acc?.pubkey.toString() === stakePool.rewarder.toString()
    );

    const tokenPrice = tokenPricesById.get(stakePool.mint.toString());
    const liquidityElement = element.addLiquidity({
      link: tokenPrice?.link,
      sourceRefs: [{ address: stakePool.pubkey.toString(), name: 'Pool' }],
      ref: mainMiner.pubkey.toString(),
    });

    // Main position, the LP
    liquidityElement.addAsset({
      address: stakePool.mint,
      amount: mainMiner.amount,
    });

    // The first Reward account
    if (firstRewarder)
      liquidityElement.addRewardAsset({
        address: firstRewarder.mint,
        amount: getRewards(firstRewarder, stakePool, mainMiner),
        alreadyShifted: true,
      });

    // Additional rewards are under derived miners where Authority === mainMiner.pubkey
    const addionalMiners = minerAccounts.filter(
      (min) => min.authority.toString() === mainMiner.pubkey.toString()
    );
    addionalMiners.forEach((miner) => {
      const pool = stakePoolAccounts.find(
        (p) => p?.pubkey.toString() === miner.pool.toString()
      );
      if (!pool) return;
      const nextRewarder = rewarderAccounts.find(
        (r) => r?.pubkey.toString() === pool?.rewarder.toString()
      );
      if (!nextRewarder) return;

      liquidityElement.addRewardAsset({
        address: miner.pool,
        amount: getRewards(nextRewarder, pool, miner),
      });
    });
  }
  return registry.getElements(cache);
};
const fetcher: Fetcher = {
  id: `${platformId}-staked-pools`,
  executor,
  networkId: NetworkId.solana,
};
export default fetcher;
