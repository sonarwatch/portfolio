import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';

import { getAddress } from 'viem';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, wFXBAddress } from './constants';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { getEvmClient } from '../../utils/clients';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

function fetcher(): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(NetworkId.fraxtal);

    const balanceBigInt = await client.readContract({
      address: wFXBAddress,
      abi: balanceOfErc20ABI,
      functionName: 'balanceOf',
      args: [getAddress(owner)],
    });

    const balanceBN = new BigNumber(balanceBigInt.toString());

    const decimals = 18;
    const balance = balanceBN.div(10 ** decimals).toNumber();

    const tokenPrice = await cache.getTokenPrice(
      wFXBAddress,
      NetworkId.fraxtal
    );

    const asset = tokenPriceToAssetToken(
      wFXBAddress,
      balance,
      NetworkId.fraxtal,
      tokenPrice
    );

    const element: PortfolioElement = {
      networkId: NetworkId.ethereum,
      label: 'Deposit',
      platformId,
      type: PortfolioElementType.multiple,
      value: asset.value,
      data: {
        assets: [asset],
      },
    };

    return [element];
  };

  return {
    id: `${platformId}-${NetworkId.fraxtal}-yield`,
    networkId: NetworkId.fraxtal,
    executor,
  };
}

export default fetcher;
