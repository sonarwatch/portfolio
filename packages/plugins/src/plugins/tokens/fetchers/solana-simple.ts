import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { getTokenAccountsByOwner } from '../../../utils/solana/getTokenAccountsByOwner';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const tokenAccounts = await getTokenAccountsByOwner(owner).then((accs) =>
    accs.filter((a) => !a.amount.isZero())
  );

  const elementRegistry = new ElementRegistry(
    NetworkId.solana,
    walletTokensPlatformId
  );
  const element = elementRegistry.addElementMultiple({
    label: 'Wallet',
  });

  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenAccounts.map((a) => a.mint.toString()),
    NetworkId.solana
  );

  // accounts.forEach((tokenAccount) => {
  tokenAccounts.forEach((tokenAccount) => {
    const address = tokenAccount.mint.toString();
    const tokenPrice = tokenPrices.get(address);
    if (tokenPrice && tokenPrice.platformId !== walletTokensPlatformId) return;
    if (!tokenPrice) return;

    const { amount } = tokenAccount;

    element.addAsset({
      address,
      amount: amount.shiftedBy(-tokenPrice.decimals),
      alreadyShifted: true,
      ref: tokenAccount.pubkey,
    });
  });
  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatformId}-solana-simple`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
