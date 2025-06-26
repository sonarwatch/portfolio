import {
  NetworkId,
  solanaNetwork,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const amount = await client.getBalance(new PublicKey(owner));
  if (amount === 0) return [];

  const elementRegistry = new ElementRegistry(
    NetworkId.solana,
    walletTokensPlatformId
  );

  const element = elementRegistry.addElementMultiple({
    label: 'Wallet',
  });

  element.addAsset({
    address: solanaNetwork.native.address,
    amount,
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatformId}-solana-native`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
