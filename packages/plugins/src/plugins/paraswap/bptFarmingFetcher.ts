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
import { PSPToken, bptParaFarmer, platformId } from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getPoolTokensAbi, getTotalRewardsAbi, totalSupplyAbi } from './abis';

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

  const totalSupplyContract = {
    address: bptParaFarmer.token,
    abi: totalSupplyAbi,
    functionName: totalSupplyAbi[0].name,
  } as const;

  const getPoolContract = {
    address: bptParaFarmer.vault,
    abi: getPoolTokensAbi,
    functionName: getPoolTokensAbi[0].name,
    args: [bptParaFarmer.poolId],
  } as const;

  const totalRewardsContract = {
    address: bptParaFarmer.poolId,
    abi: getTotalRewardsAbi,
    functionName: getTotalRewardsAbi[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const { underlyings } = bptParaFarmer;

  const [totalSupply, poolTokens, pendingReward] = await Promise.all([
    client.readContract(totalSupplyContract),
    client.readContract(getPoolContract),
    client.readContract(totalRewardsContract),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokens, balances, lastChangeBlock] = poolTokens;

  const tokensPrices = await cache.getTokenPrices(
    [...bptParaFarmer.underlyings, PSPToken.address],
    NetworkId.ethereum
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokensPrices) {
    if (!tokenPrice) continue;
    tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  if (tokenPriceById.values.length === 0) return [];

  const liquidities: PortfolioLiquidity[] = [];
  const assets: PortfolioAssetToken[] = [];
  const rewardAssets: PortfolioAsset[] = [];
  for (let i = 0; i < underlyings.length; i++) {
    const underlying = underlyings[i];
    const tokenPrice = tokenPriceById.get(underlying);
    if (!tokenPrice) continue;

    const underlyingsAmount = new BigNumber(balances[i].toString())
      .multipliedBy(new BigNumber(balance.toString()))
      .dividedBy(new BigNumber(totalSupply.toString()))
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
  if (pspTokenPrice) {
    rewardAssets.push(
      tokenPriceToAssetToken(
        PSPToken.address,
        Number(pendingReward),
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
