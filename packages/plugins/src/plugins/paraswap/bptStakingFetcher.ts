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
import {
  bptInfoKey,
  bptParaStaker,
  platformId,
  poolAddresses,
} from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { PoolInfo } from './types';
import { pendingWithdrawalsAbi } from './abis';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const pendingWithdrawalsContract = {
    address: bptParaStaker.address,
    abi: pendingWithdrawalsAbi,
    functionName: 'userVsWithdrawals',
    args: [owner as `0x${string}`, BigInt(0)],
    // Here we might miss pending withdrawal if user has more than 1
    // We will need to find a way to know how many pending withdrawals exist for a user
  } as const;

  const pendingWithdrawalsRes = await client.readContract(
    pendingWithdrawalsContract
  );

  const unlockingBalance = pendingWithdrawalsRes[0];

  const balanceOfContract = {
    address: bptParaStaker.address,
    abi: balanceOfErc20ABI,
    functionName: balanceOfErc20ABI[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const lockedBalance = await client.readContract(balanceOfContract);
  if (lockedBalance === BigInt(0) && unlockingBalance === BigInt(0)) return [];

  const { underlyings } = poolAddresses;

  const poolInfo = await cache.getItem<PoolInfo>(bptInfoKey, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });
  if (!poolInfo) return [];

  const { balances } = poolInfo;
  const { totalSupply } = poolInfo;

  const tokensPrices = await cache.getTokenPrices(
    underlyings,
    NetworkId.ethereum
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokensPrices) {
    if (!tokenPrice) continue;
    tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  const lockedAssets: PortfolioAssetToken[] = [];
  const unlockingAssets: PortfolioAssetToken[] = [];

  for (let i = 0; i < underlyings.length; i++) {
    const underlying = underlyings[i];
    const tokenPrice = tokenPriceById.get(underlying);
    if (!tokenPrice) continue;

    const underlyingAmountRaw = new BigNumber(balances[i].toString()).dividedBy(
      totalSupply
    );

    if (lockedBalance !== BigInt(0)) {
      const underlyingsAmountLocked = underlyingAmountRaw
        .multipliedBy(new BigNumber(lockedBalance.toString()))
        .dividedBy(10 ** tokenPrice.decimals)
        .toNumber();

      lockedAssets.push(
        tokenPriceToAssetToken(
          underlying,
          underlyingsAmountLocked,
          NetworkId.ethereum,
          tokenPrice
        )
      );
    }

    if (unlockingBalance !== BigInt(0)) {
      const underlyingsAmountUnlocking = underlyingAmountRaw
        .multipliedBy(new BigNumber(unlockingBalance.toString()))
        .dividedBy(10 ** tokenPrice.decimals)
        .toNumber();

      unlockingAssets.push(
        tokenPriceToAssetToken(
          underlying,
          underlyingsAmountUnlocking,
          NetworkId.ethereum,
          tokenPrice
        )
      );
    }
  }
  if (lockedAssets.length === 0 && unlockingAssets.length === 0) return [];

  const elements: PortfolioElement[] = [];
  if (lockedAssets.length !== 0) {
    const assetsValue = getUsdValueSum(lockedAssets.map((a) => a.value));

    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      value: assetsValue,
      data: {
        liquidities: [
          {
            assets: lockedAssets,
            assetsValue,
            rewardAssets: [],
            rewardAssetsValue: null,
            value: assetsValue,
            yields: [],
          },
        ],
      },
    });
  }

  const unlockEpoch = Number(pendingWithdrawalsRes[1]);
  const dateToDisplay = new Date(unlockEpoch * 1000).toLocaleDateString();

  if (unlockingAssets.length !== 0) {
    const assetsValue = getUsdValueSum(unlockingAssets.map((a) => a.value));
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      name: `Unlocking on ${dateToDisplay}`,
      value: assetsValue,
      data: {
        liquidities: [
          {
            assets: unlockingAssets,
            assetsValue,
            rewardAssets: [],
            rewardAssetsValue: null,
            value: assetsValue,
            yields: [],
          },
        ],
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-bptStaking-fetcher`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
