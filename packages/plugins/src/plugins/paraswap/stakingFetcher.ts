import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { PSPToken, platformId, stakers } from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { userVsNextIDAbi, userVsWithdrawalsAbi } from './abis';
import { WithdrawStatus } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const baseLockedContract = {
    abi: balanceOfErc20ABI,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
  } as const;

  const baseUnlockingContract = {
    abi: userVsWithdrawalsAbi,
    functionName: 'userVsWithdrawals',
  } as const;

  const lockedContracts = [];
  const unlockingContracts = [];
  for (const staker of stakers) {
    const nbrOfWithdrawContract = {
      address: staker.address as `0x${string}`,
      abi: userVsNextIDAbi,
      functionName: userVsNextIDAbi[0].name,
      args: [owner as `0x${string}`],
    } as const;

    const nbrOfWithdraws = await client.readContract(nbrOfWithdrawContract);
    for (let i = BigInt(0); i < nbrOfWithdraws; i++) {
      unlockingContracts.push({
        address: staker.address as `0x${string}`,
        ...baseUnlockingContract,
        args: [owner as `0x${string}`, i],
      } as const);
    }
    lockedContracts.push({
      ...baseLockedContract,
      address: staker.address as `0x${string}`,
    } as const);
  }

  const [lockedBalancesRes, unlockingBalancesRes] = await Promise.all([
    client.multicall({ contracts: lockedContracts }),
    client.multicall({ contracts: unlockingContracts }),
  ]);

  const lockedBalances = lockedBalancesRes.map((res) =>
    res.status === 'failure' ? BigInt(0) : res.result
  );
  const unlockingBalances = [];
  const unlockingTs = [];
  const statuses = [];
  for (let n = 0; n < unlockingBalancesRes.length; n++) {
    const res = unlockingBalancesRes[n];
    if (res.status === 'success') {
      unlockingBalances.push(res.result[0]);
      unlockingTs.push(res.result[1]);
      statuses.push(res.result[2]);
    } else {
      statuses.push(undefined);
    }
  }

  if (
    !lockedBalances.some((value) => value !== BigInt(0)) &&
    !unlockingBalances.some((value) => value !== BigInt(0))
  )
    return [];

  const pspTokenPrice = await cache.getTokenPrice(
    PSPToken.address,
    NetworkId.ethereum
  );
  if (!pspTokenPrice) return [];

  const unlockingAssets: PortfolioAssetToken[] = [];

  for (let j = 0; j < unlockingBalances.length; j++) {
    const status = statuses[j];
    if (
      status &&
      status === WithdrawStatus.UNLOCKING &&
      unlockingBalances[j] > BigInt(0)
    ) {
      const unlockingAmount = new BigNumber(
        unlockingBalances[j].toString()
      ).dividedBy(10 ** pspTokenPrice.decimals);

      unlockingAssets.push({
        ...tokenPriceToAssetToken(
          pspTokenPrice.address,
          unlockingAmount.toNumber(),
          NetworkId.ethereum,
          pspTokenPrice
        ),
        attributes: {
          lockedUntil: Number(unlockingTs[j]),
        },
      });
    }
  }

  const lockedAssets: PortfolioAssetToken[] = [];
  for (let i = 0; i < lockedBalances.length; i++) {
    const lockedAmount = new BigNumber(lockedBalances[i].toString()).dividedBy(
      10 ** pspTokenPrice.decimals
    );

    if (lockedAmount.isGreaterThan(0)) {
      lockedAssets.push(
        tokenPriceToAssetToken(
          pspTokenPrice.address,
          lockedAmount.toNumber(),
          NetworkId.ethereum,
          pspTokenPrice
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
