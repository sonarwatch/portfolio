import { NetworkId, ethereumNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId, withdrawlQueueAddress } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { withdrawlQueueAbi } from './abis';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ethFactor } from '../../utils/evm/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);
  const withdrawalRequests = await client.readContract({
    abi: withdrawlQueueAbi,
    address: withdrawlQueueAddress,
    functionName: 'getWithdrawalRequests',
    args: [owner as `0x${string}`],
  });
  if (withdrawalRequests.length === 0) return [];

  const withdrawalStatus = await client.readContract({
    abi: withdrawlQueueAbi,
    address: withdrawlQueueAddress,
    functionName: 'getWithdrawalStatus',
    args: [withdrawalRequests],
  });
  let amount = BigNumber(0);
  withdrawalStatus.forEach((cStatus) => {
    if (cStatus.isClaimed) return;
    amount = amount.plus(cStatus.amountOfStETH.toString());
  });
  if (amount.isZero()) return [];

  const ethTokenPrice = await cache.getTokenPrice(
    ethereumNetwork.native.address,
    NetworkId.ethereum
  );

  const asset = tokenPriceToAssetToken(
    ethereumNetwork.native.address,
    amount.div(ethFactor).toNumber(),
    NetworkId.ethereum,
    ethTokenPrice
  );

  return [
    {
      type: 'multiple',
      label: 'Deposit',
      networkId: NetworkId.ethereum,
      platformId,
      value: asset.value,
      data: {
        assets: [asset],
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-withdrawls`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
