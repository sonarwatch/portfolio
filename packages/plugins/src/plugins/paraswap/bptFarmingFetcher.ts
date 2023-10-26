import {
  NetworkId,
  PortfolioAsset,
  PortfolioAssetToken,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { PSPToken, bptInfoKey, bptParaFarmer, platformId } from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getTotalRewardsAbi } from './abis';
import { BptInfo } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const balanceOfContract = {
    address: bptParaFarmer.address,
    abi: balanceOfErc20ABI,
    functionName: balanceOfErc20ABI[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const balance = await client.readContract(balanceOfContract);
  if (balance === BigInt(0)) return [];

  const totalRewardsContract = {
    address: bptParaFarmer.address,
    abi: getTotalRewardsAbi,
    functionName: getTotalRewardsAbi[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const pendingReward = await client.readContract(totalRewardsContract);

  const { underlyings } = bptParaFarmer;

  const tokensPrices = await cache.getTokenPrices(
    bptParaFarmer.underlyings,
    NetworkId.ethereum
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokensPrices) {
    if (!tokenPrice) continue;
    tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  const bptInfo = await cache.getItem<BptInfo>(bptInfoKey, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });
  if (!bptInfo) return [];

  const { balances } = bptInfo.farming;
  const { totalSupply } = bptInfo.farming;

  const liquidities: PortfolioLiquidity[] = [];
  const assets: PortfolioAssetToken[] = [];
  const rewardAssets: PortfolioAsset[] = [];
  for (let i = 0; i < underlyings.length; i++) {
    const underlying = underlyings[i];
    const tokenPrice = tokenPriceById.get(underlying);
    if (!tokenPrice) continue;

    const underlyingsAmount = new BigNumber(balances[i].toString())
      .multipliedBy(new BigNumber(balance.toString()))
      .dividedBy(totalSupply)
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();

    assets.push(
      tokenPriceToAssetToken(
        underlying,
        underlyingsAmount,
        NetworkId.ethereum,
        tokenPrice
      )
    );
  }
  if (assets.length === 0) return [];

  const pspTokenPrice = tokenPriceById.get(PSPToken.address);
  if (pspTokenPrice && pendingReward > BigInt(0)) {
    rewardAssets.push(
      tokenPriceToAssetToken(
        PSPToken.address,
        new BigNumber(pendingReward.toString())
          .dividedBy(10 ** pspTokenPrice.decimals)
          .toNumber(),
        NetworkId.ethereum,
        pspTokenPrice
      )
    );
  }
  const assetsValue = getUsdValueSum(assets.map((a) => a.value));
  const rewardsValue = getUsdValueSum(rewardAssets.map((a) => a.value));

  liquidities.push({
    assets,
    assetsValue: getUsdValueSum(assets.map((a) => a.value)),
    rewardAssets,
    rewardAssetsValue: getUsdValueSum(rewardAssets.map((a) => a.value)),
    value: getUsdValueSum([assetsValue, rewardsValue]),
    yields: [],
  });

  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Farming',
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: { liquidities },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-bptFarming-fetcher`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
