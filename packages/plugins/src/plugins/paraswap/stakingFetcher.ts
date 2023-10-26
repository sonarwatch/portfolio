import {
  NetworkId,
  PortfolioAssetToken,
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

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const baseContract = {
    abi: balanceOfErc20ABI,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
  } as const;

  const tokens: Set<string> = new Set();
  const contracts = [];
  for (const staker of stakers) {
    tokens.add(staker.token);
    contracts.push({
      ...baseContract,
      address: staker.address as `0x${string}`,
    } as const);
  }

  const [tokensPrices, contractsRes] = await Promise.all([
    cache.getTokenPrices(Array.from(tokens), NetworkId.ethereum),
    client.multicall({ contracts }),
  ]);

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokensPrices) {
    if (!tokenPrice) continue;
    tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  const assets: PortfolioAssetToken[] = [];
  for (let i = 0; i < stakers.length; i++) {
    const staker = stakers[i];
    const amountRes = contractsRes[i];
    const tokenPrice = tokenPriceById.get(staker.token);
    if (!tokenPrice) continue;

    const amount =
      amountRes.status === 'failure'
        ? undefined
        : new BigNumber(amountRes.result.toString())
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber();

    if (!amount) continue;

    assets.push(
      tokenPriceToAssetToken(
        tokenPrice.address,
        amount,
        NetworkId.ethereum,
        tokenPrice
      )
    );
  }

  return [
    {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: { assets },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking-fetcher`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
