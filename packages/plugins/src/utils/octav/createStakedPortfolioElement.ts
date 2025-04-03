import {
  NetworkIdType,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { LoggingContext, verboseLog } from './loggingUtils';

export const createStakedPortfolioElement = async (
  platformId: string,
  networkId: NetworkIdType,
  assetContractAddress: Address,
  priceTokenAddress: Address,
  amount: number,
  cache: Cache,
  logCtx: LoggingContext
): Promise<PortfolioElement | undefined> => {
  const tokenPrice = await cache.getTokenPrice(priceTokenAddress, networkId);
  verboseLog(
    {
      ...logCtx,
      priceTokenAddress,
      tokenPrice,
    },
    'Token price retrieved from cache'
  );

  const asset = tokenPriceToAssetToken(
    assetContractAddress,
    amount,
    networkId,
    tokenPrice
  );

  return {
    networkId,
    label: 'Staked',
    platformId,
    type: PortfolioElementType.multiple,
    value: asset.value,
    data: {
      assets: [asset],
    },
  };
};
