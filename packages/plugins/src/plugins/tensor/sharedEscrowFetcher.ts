import {
  NetworkId,
  PortfolioElementType,
  solanaNativeAddress,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { findMarginPDA } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const marginPDA = findMarginPDA(owner);

  const solRawBalance = await client.getBalance(marginPDA);

  if (!solRawBalance || solRawBalance === 0) return [];

  const rent = await client.getMinimumBalanceForRentExemption(8);

  const solTokenPrice = await cache.getTokenPrice(
    solanaNativeAddress,
    NetworkId.solana
  );

  const amount = new BigNumber(solRawBalance)
    .minus(rent)
    .dividedBy(10 ** solanaNetwork.native.decimals)
    .toNumber();

  const asset = tokenPriceToAssetToken(
    solanaNativeAddress,
    amount,
    NetworkId.solana,
    solTokenPrice
  );

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      name: 'Shared Escrow',
      value: asset.value,
      data: { assets: [asset] },
    },
  ];
};
const fetcher: Fetcher = {
  id: `${platformId}-shared-escrow`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
