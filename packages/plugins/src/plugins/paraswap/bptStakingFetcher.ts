import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { bptParaStake, platformId } from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getPoolTokensAbi, totalSupplyAbi } from './abis';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const balanceOfContract = {
    address: bptParaStake.address,
    abi: balanceOfErc20ABI,
    functionName: balanceOfErc20ABI[0].name,
    args: [owner as `0x${string}`],
  } as const;

  const balance = await client.readContract(balanceOfContract);
  if (balance === BigInt(0)) return [];

  const totalSupplyContract = {
    address: bptParaStake.token,
    abi: totalSupplyAbi,
    functionName: totalSupplyAbi[0].name,
  } as const;

  const getPoolContract = {
    address: bptParaStake.vault,
    abi: getPoolTokensAbi,
    functionName: getPoolTokensAbi[0].name,
    args: [bptParaStake.poolId],
  } as const;

  const { underlyings } = bptParaStake;

  const [totalSupply, poolTokens] = await Promise.all([
    client.readContract(totalSupplyContract),
    client.readContract(getPoolContract),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokens, balances, lastChangeBlock] = poolTokens;

  const tokensPrices = await cache.getTokenPrices(
    bptParaStake.underlyings,
    NetworkId.ethereum
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokensPrices) {
    if (!tokenPrice) continue;
    tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  const liquidities: PortfolioLiquidity[] = [];
  const assets: PortfolioAssetToken[] = [];
  for (let i = 0; i < underlyings.length; i++) {
    const underlying = underlyings[i];
    const tokenPrice = tokenPriceById.get(underlying);
    if (!tokenPrice) continue;

    const underlyingsAmount = new BigNumber(balances[i].toString())
      .multipliedBy(new BigNumber(balance.toString()))
      .dividedBy(new BigNumber(totalSupply.toString()))
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

  const assetsValue = getUsdValueSum(assets.map((a) => a.value));

  liquidities.push({
    assets,
    assetsValue: getUsdValueSum(assets.map((a) => a.value)),
    rewardAssets: [],
    rewardAssetsValue: null,
    value: assetsValue,
    yields: [],
  });

  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: { liquidities },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-bptStaking-fetcher`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
