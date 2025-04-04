import { PortfolioElement, EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';

import { DEPOSIT_LABEL, platformId, STAKED_LABEL } from './constants';
import { Cache } from '../../Cache';
import { getBalances } from '../../utils/evm/getBalances';
import {
  RenzoContractConfig,
  RenzoNetworkConfig,
  RenzoStakedContractConfig,
} from './types';
import { getEvmClient } from '../../utils/clients';
import {
  activeStakeAbi,
  getOutstandingWithdrawRequestsAbi,
  withdrawRequestAbi,
} from './abis';
import { createPortfolioElement } from '../../utils/octav/portfolioElement';

async function generateStakedElements(
  stakedContracts: RenzoStakedContractConfig[],
  balances: (bigint | null)[],
  cache: Cache,
  networkId: EvmNetworkIdType
): Promise<PortfolioElement[]> {
  const elements = await Promise.all(
    stakedContracts.map(async (contract, index) => {
      const balance = balances[index];
      return balance && balance !== BigInt(0)
        ? createPortfolioElement(
            contract.token,
            balance,
            STAKED_LABEL,
            cache,
            networkId
          )
        : null;
    })
  );

  return elements.filter((el) => el !== null);
}

async function generateActiveStakeElement(
  activeStakeContract: RenzoStakedContractConfig,
  owner: string,
  cache: Cache,
  networkId: EvmNetworkIdType
): Promise<PortfolioElement | null> {
  const { address, token } = activeStakeContract;

  const client = getEvmClient(networkId);
  const activeStake = await client.readContract({
    address,
    abi: activeStakeAbi,
    functionName: 'activeStake',
    args: [owner as `0x${string}`],
  });

  if (!activeStake || activeStake === BigInt(0)) return null;

  return createPortfolioElement(
    token,
    activeStake,
    STAKED_LABEL,
    cache,
    networkId
  );
}

async function generateDepositElement(
  depositContract: RenzoContractConfig,
  owner: string,
  cache: Cache,
  networkId: EvmNetworkIdType
): Promise<PortfolioElement[]> {
  const { address } = depositContract;
  const client = getEvmClient(networkId);

  const numOfRequests = await client.readContract({
    address,
    abi: getOutstandingWithdrawRequestsAbi,
    functionName: 'getOutstandingWithdrawRequests',
    args: [owner as `0x${string}`],
  });

  if (!numOfRequests || numOfRequests === BigInt(0)) return [];

  const withdrawRequestsAnswers = await client.multicall({
    contracts: Array.from({ length: Number(numOfRequests) }, (_, index) => ({
      address: address as `0x${string}`,
      abi: withdrawRequestAbi,
      functionName: 'withdrawRequests',
      args: [owner as `0x${string}`, BigInt(index)],
    })),
  });

  const portfolioElements = await Promise.all(
    withdrawRequestsAnswers
      .filter((req) => req.status === 'success' && req.result)
      .map((req) => {
        const token = req.result?.[0];
        const balance = req.result?.[2];

        if (!token || !balance) return null;

        return createPortfolioElement(
          token,
          balance,
          DEPOSIT_LABEL,
          cache,
          networkId
        );
      })
  );

  return portfolioElements.filter((el) => el !== null);
}

export function getPositionsFetcher(config: RenzoNetworkConfig): Fetcher {
  const { networkId, stakedContracts, activeStakeContract, depositContract } =
    config;

  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    if (!owner) return [];

    const contractAddresses = stakedContracts.map(
      (contract) => contract.address
    );

    const [balances, activeStakedElement, depositElement] = await Promise.all([
      getBalances(owner, contractAddresses, networkId),
      generateActiveStakeElement(activeStakeContract, owner, cache, networkId),
      generateDepositElement(depositContract, owner, cache, networkId),
    ]);

    const stakedElements = await generateStakedElements(
      stakedContracts,
      balances,
      cache,
      networkId
    );

    return [
      ...stakedElements,
      ...(activeStakedElement ? [activeStakedElement] : []),
      ...depositElement,
    ];
  };

  return {
    id: `${platformId}-${networkId}`,
    networkId,
    executor,
  };
}
