import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakers } from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { pendingWithdrawalsAbi } from './abis';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const baseLockedContract = {
    abi: balanceOfErc20ABI,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
  } as const;

  const baseUnlockingContract = {
    abi: pendingWithdrawalsAbi,
    functionName: 'userVsWithdrawals',
    args: [owner as `0x${string}`, BigInt(0)],
    // Here we might miss pending withdrawal if user has more than 1
    // We will need to find a way to know how many pending withdrawals exist for a user
  } as const;

  const tokens: Set<string> = new Set();
  const lockedContracts = [];
  const unlockingContracts = [];
  for (const staker of stakers) {
    tokens.add(staker.token);
    unlockingContracts.push({
      ...baseUnlockingContract,
      address: staker.address as `0x${string}`,
    });
    lockedContracts.push({
      ...baseLockedContract,
      address: staker.address as `0x${string}`,
    } as const);
  }

  const [tokensPrices, lockedBalancesRes, unlockingBalancesRes] =
    await Promise.all([
      cache.getTokenPrices(Array.from(tokens), NetworkId.ethereum),
      client.multicall({ contracts: lockedContracts }),
      client.multicall({ contracts: unlockingContracts }),
    ]);

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokensPrices) {
    if (!tokenPrice) continue;
    tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  const lockedAssets: PortfolioAssetToken[] = [];
  const unlockingAssets: PortfolioAssetToken[] = [];
  for (let i = 0; i < stakers.length; i++) {
    const staker = stakers[i];
    const lockedAmountRes = lockedBalancesRes[i];
    const unlockingAmountRes = unlockingBalancesRes[i];

    const tokenPrice = tokenPriceById.get(staker.token);
    if (!tokenPrice) continue;

    const lockedAmount =
      lockedAmountRes.status === 'failure'
        ? undefined
        : new BigNumber(lockedAmountRes.result.toString())
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber();

    const unlockingAmount =
      unlockingAmountRes.status === 'failure'
        ? undefined
        : new BigNumber(unlockingAmountRes.result[0].toString())
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber();

    if (lockedAmount) {
      lockedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          lockedAmount,
          NetworkId.ethereum,
          tokenPrice
        )
      );
    }

    if (unlockingAmount) {
      // TODO : Unlocking date can be found here, not supported by our Data Structure for now.
      // const unlockEpoch = Number(unlockingAmountRes.result?.[1]);
      // const dateToDisplay = new Date(unlockEpoch * 1000).toLocaleDateString();
      unlockingAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          unlockingAmount,
          NetworkId.ethereum,
          tokenPrice
        )
      );
    }
  }

  const elements: PortfolioElement[] = [];
  if (lockedAssets.length !== 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      value: getUsdValueSum(lockedAssets.map((a) => a.value)),
      data: { assets: lockedAssets },
    });
  }

  if (unlockingAssets.length !== 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      name: 'Unlocking',
      value: getUsdValueSum(unlockingAssets.map((a) => a.value)),
      data: { assets: unlockingAssets },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-staking-fetcher`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
