import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import {
  bptInfoKey,
  bptParaFarmer,
  bptParaStake,
  platformId,
} from './constants';
import { getPoolTokensAbi, totalSupplyAbi } from './abis';
import { BptInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const totalSupplyFarmingContract = {
    address: bptParaFarmer.token,
    abi: totalSupplyAbi,
    functionName: totalSupplyAbi[0].name,
  } as const;

  const getPoolFarmingContract = {
    address: bptParaFarmer.vault,
    abi: getPoolTokensAbi,
    functionName: getPoolTokensAbi[0].name,
    args: [bptParaFarmer.poolId],
  } as const;

  const totalSupplyStakingContract = {
    address: bptParaStake.token,
    abi: totalSupplyAbi,
    functionName: totalSupplyAbi[0].name,
  } as const;

  const getPoolStakingContract = {
    address: bptParaStake.vault,
    abi: getPoolTokensAbi,
    functionName: getPoolTokensAbi[0].name,
    args: [bptParaStake.poolId],
  } as const;

  const [
    totalSupplyStaking,
    stakingPoolTokens,
    totalSupplyFarming,
    farmingPoolTokens,
  ] = await Promise.all([
    client.readContract(totalSupplyStakingContract),
    client.readContract(getPoolStakingContract),
    client.readContract(totalSupplyFarmingContract),
    client.readContract(getPoolFarmingContract),
  ]);

  const bptInfo: BptInfo = {
    farming: {
      totalSupply: totalSupplyStaking.toString(),
      balances: farmingPoolTokens[1].map((balance) => balance.toString()),
    },
    staking: {
      totalSupply: totalSupplyFarming.toString(),
      balances: stakingPoolTokens[1].map((balance) => balance.toString()),
    },
  };

  await cache.setItem(bptInfoKey, bptInfo, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });
};

const job: Job = {
  id: `${platformId}-bpt-info`,
  executor,
};
export default job;
