import {
  EvmNetworkIdType,
  PortfolioElement,
  PortfolioElementLabel,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { getAmount } from './tokenFactor';
import BigNumber from 'bignumber.js';
import { platformId } from '../../plugins/renzo/constants';

export async function createPortfolioElement(
  tokenAddress: `0x${string}`,
  balanceValue: bigint,
  label: PortfolioElementLabel,
  cache: Cache,
  networkId: EvmNetworkIdType
): Promise<PortfolioElement | null> {
  const tokenPrice = await cache.getTokenPrice(tokenAddress, networkId);

  if (!tokenPrice) return null;

  const balance = getAmount(new BigNumber(balanceValue.toString()));
  const asset = tokenPriceToAssetToken(
    tokenAddress,
    balance,
    networkId,
    tokenPrice
  );

  return {
    networkId,
    platformId,
    label,
    type: PortfolioElementType.multiple,
    value: asset.value,
    data: {
      assets: [asset],
    },
  };
}
