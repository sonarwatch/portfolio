import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, polisDecimals, polisMint } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getEscrowAddress,
  getProxyAddress,
  getProxyEscrowAddress,
} from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { escrowStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const proxyEscrowAddress = getProxyEscrowAddress(owner);
  const proxyAddress = getProxyAddress(proxyEscrowAddress.toString(), owner);
  const escrowAddress = getEscrowAddress(proxyAddress);
  const account = await getParsedAccountInfo(
    connection,
    escrowStruct,
    escrowAddress
  );
  if (!account || account.amount.isZero()) return [];

  const polisTokenPrice = await cache.getTokenPrice(
    polisMint,
    NetworkId.solana
  );
  const amount = account.amount.div(10 ** polisDecimals).toNumber();
  const asset = tokenPriceToAssetToken(
    polisMint,
    amount,
    NetworkId.solana,
    polisTokenPrice,
    polisTokenPrice?.price,
    {
      lockedUntil: account.escrowEndsAt.toNumber() * 1000,
    }
  );
  return [
    {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      label: 'Staked',
      platformId,
      data: {
        assets: [asset],
        ref: account.pubkey.toString(),
        link: 'https://govern.staratlas.com/lockers/polis',
      },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-lockers`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
