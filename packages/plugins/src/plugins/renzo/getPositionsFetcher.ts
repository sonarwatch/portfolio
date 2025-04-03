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
  const contractsWithBalances = stakedContracts.filter(
    (_, index) => balances[index] !== null && balances[index] !== BigInt(0)
  );
  const balancesWithValues = balances.filter(
    (balance) => balance !== null && balance !== BigInt(0)
  ) as bigint[];

  if (contractsWithBalances.length === 0) return [];

  const elements = await Promise.all(
    contractsWithBalances.map(async (contract, index) => {
      return createPortfolioElement(
        contract.token,
        balancesWithValues[index],
        STAKED_LABEL,
        cache,
        networkId
      );
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

  try {
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
  } catch (error) {
    console.error(
      `Error processing contract ${address} for ${owner} on ${networkId}:`,
      error
    );
    return null;
  }
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

  const withdrawRequestsAnswers = await Promise.all(
    Array.from({ length: Number(numOfRequests) }, (_, index) =>
      client.readContract({
        address,
        abi: withdrawRequestAbi,
        functionName: 'withdrawRequests',
        args: [owner as `0x${string}`, BigInt(index)],
      })
    )
  );

  const portfolioElements = await Promise.all(
    withdrawRequestsAnswers
      .filter((req) => req !== null)
      .map((req) => {
        const token = req[0];
        const balance = req[2];

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

export function getStakedPositionsFetcher(config: RenzoNetworkConfig): Fetcher {
  const { networkId, stakedContracts, activeStakeContract } = config;

  async function processStakedContracts(
    owner: string,
    cache: Cache
  ): Promise<PortfolioElement[]> {
    const contractAddresses = stakedContracts.map(
      (contract) => contract.address
    );
    const balances = await getBalances(owner, contractAddresses, networkId);

    return generateStakedElements(stakedContracts, balances, cache, networkId);
  }

  async function processActiveStakeContract(
    owner: string,
    cache: Cache
  ): Promise<PortfolioElement | null> {
    return generateActiveStakeElement(
      activeStakeContract,
      owner,
      cache,
      networkId
    );
  }

  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    if (!owner) return [];

    const [stakedElements, activeStakedElement] = await Promise.all([
      processStakedContracts(owner, cache),
      processActiveStakeContract(owner, cache),
    ]);

    return [
      ...stakedElements,
      ...(activeStakedElement ? [activeStakedElement] : []),
    ];
  };

  return {
    id: `${platformId}-${networkId}`,
    networkId,
    executor,
  };
}
