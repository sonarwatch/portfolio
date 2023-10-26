import {
  EvmNetworkIdType,
  PortfolioAssetToken,
  PortfolioElementMultiple,
  PortfolioElementType,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { BigNumber } from 'bignumber.js';
import { getAddress } from 'viem';
import { Cache } from '../../../../Cache';
import { FetcherExecutor } from '../../../../Fetcher';
import { getEvmClient } from '../../../../utils/clients';
import { balanceOfErc20ABI } from '../../../../utils/evm/erc20Abi';
import tokenPriceToAssetToken from '../../../../utils/misc/tokenPriceToAssetToken';
import { TokenList } from '../../types';
import { tokenListsPrefix, walletTokensPlatform } from '../../constants';
import { topTokensPrefix } from '../../../top-tokens/constants';

const maxTopTokens = 75;
export default function getEvmFetcherExecutor(
  networkId: EvmNetworkIdType,
  topTokens: boolean
): FetcherExecutor {
  return async (owner: string, cache: Cache) => {
    if (!topTokens) return [];

    // tokenListAddresses
    const tokenList = await cache.getItem<TokenList>(networkId, {
      prefix: tokenListsPrefix,
    });
    if (!tokenList || tokenList.tokens.length === 0) return [];
    const tokenListAddresses = tokenList.tokens.map((token) => token.address);

    // topAddresses
    const topAddresses: string[] | undefined = (
      await cache.getItem<string[]>(networkId, {
        prefix: topTokensPrefix,
      })
    )?.slice(0, maxTopTokens);
    if (!topAddresses) return [];

    // addresses = tokenListAddresses ∩ topAddresses
    const addresses = tokenListAddresses.filter((x) =>
      topAddresses.includes(x)
    );
    const tPricesRes = await cache.getTokenPrices(addresses, networkId);
    const tokenPrices: TokenPrice[] = tPricesRes.filter(
      (tp) => tp !== undefined
    ) as TokenPrice[];

    const commonProps = {
      abi: balanceOfErc20ABI,
      functionName: 'balanceOf',
      args: [getAddress(owner)],
    } as const;
    const contracts = tokenPrices.map(
      (tp) =>
        ({
          address: getAddress(tp.address),
          ...commonProps,
        } as const)
    );
    const client = getEvmClient(networkId);
    const contractsRes = await client.multicall({ contracts });

    const walletTokensAssets: PortfolioAssetToken[] = [];
    for (let i = 0; i < contractsRes.length; i += 1) {
      const contractRes = contractsRes[i];
      if (contractRes.status === 'failure') continue;
      if (!contractRes.result) continue;

      const tokenPrice = tokenPrices[i];
      const { address } = tokenPrice;
      const amount = new BigNumber(contractRes.result.toString())
        .div(10 ** tokenPrice.decimals)
        .toNumber();
      if (amount === 0) continue;

      const asset = tokenPriceToAssetToken(
        address,
        amount,
        networkId,
        tokenPrice
      );
      walletTokensAssets.push(asset);
    }
    if (walletTokensAssets.length === 0) return [];

    const element: PortfolioElementMultiple = {
      type: PortfolioElementType.multiple,
      networkId,
      platformId: walletTokensPlatform.id,
      label: 'Wallet',
      value: getUsdValueSum(walletTokensAssets.map((a) => a.value)),
      data: {
        assets: walletTokensAssets,
      },
    };
    return [element];
  };
}
