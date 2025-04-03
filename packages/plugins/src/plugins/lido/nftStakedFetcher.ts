import { PortfolioElement, ethereumNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  platformId,
  nftAddress,
  lidoCSMOperatorsKey,
  networkId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ethFactor } from '../../utils/evm/constants';
import { nftStakedAbi } from './abis';

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  // Get operators mapping from CSM job
  const operatorsMapping = await cache.getItem<{ [address: string]: number }>(
    lidoCSMOperatorsKey,
    {
      prefix: platformId,
      networkId,
    }
  );
  if (!operatorsMapping) return [];

  // Check if owner is a node operator
  const operatorId = operatorsMapping[owner];
  if (operatorId === undefined) return [];

  const client = getEvmClient(networkId);

  // Get bond amount for the operator
  const bondResult = await client.readContract({
    address: nftAddress,
    abi: nftStakedAbi,
    functionName: 'getBond',
    args: [BigInt(operatorId)],
  });

  if (!bondResult) return [];
  const amount = new BigNumber(bondResult.toString());
  if (amount.isZero()) return [];

  // Get ETH price for value calculation
  const ethTokenPrice = await cache.getTokenPrice(
    ethereumNetwork.native.address,
    networkId
  );

  const asset = tokenPriceToAssetToken(
    ethereumNetwork.native.address,
    amount.div(ethFactor).toNumber(),
    networkId,
    ethTokenPrice
  );

  if (!asset) return [];

  return [
    {
      type: 'multiple',
      label: 'Staked',
      networkId,
      platformId,
      value: asset.value || 0,
      data: {
        assets: [asset],
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-nft-staked`,
  networkId,
  executor,
};

export default fetcher;
