import {
  EvmNetworkIdType,
  PortfolioElementMultiple,
  PortfolioElementType,
  networks,
} from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import BigNumber from 'bignumber.js';
import { FetcherExecutor } from '../../../../Fetcher';
import { getEvmClient } from '../../../../utils/clients';
import tokenPriceToAssetToken from '../../../../utils/misc/tokenPriceToAssetToken';
import { Cache } from '../../../../Cache';
import { walletTokensPlatform } from '../../constants';

export default function getEvmFetcherNativeExecutor(
  networkId: EvmNetworkIdType
): FetcherExecutor {
  return async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const { address } = networks[networkId].native;
    const tokenPrice = await cache.getTokenPrice(address, networkId);
    if (!tokenPrice) return [];

    const balance = await client.getBalance({ address: getAddress(owner) });
    const amount = new BigNumber(balance.toString())
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    if (amount === 0) return [];

    const asset = tokenPriceToAssetToken(
      address,
      amount,
      networkId,
      tokenPrice
    );
    const element: PortfolioElementMultiple = {
      type: PortfolioElementType.multiple,
      networkId,
      platformId: walletTokensPlatform.id,
      label: 'Wallet',
      value: asset.value,
      data: {
        assets: [asset],
      },
    };
    return [element];
  };
}
