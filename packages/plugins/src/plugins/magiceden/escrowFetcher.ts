import {
  NetworkId,
  PortfolioElementType,
  solanaNativeAddress,
  solanaNativeDecimals,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getEscrowAccount } from './helpers';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const pda = getEscrowAccount(owner);
  const client = getClientSolana();

  const amount = await client.getBalance(pda);
  if (!amount) return [];

  const solTokenPrice = await cache.getTokenPrice(
    solanaNativeAddress,
    NetworkId.solana
  );

  const asset = tokenPriceToAssetToken(
    solanaNativeAddress,
    new BigNumber(amount).dividedBy(10 ** solanaNativeDecimals).toNumber(),
    NetworkId.solana,
    solTokenPrice
  );

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      name: 'Escrow',
      value: asset.value,
      data: { assets: [asset] },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-escrow`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
