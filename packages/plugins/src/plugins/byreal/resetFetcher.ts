import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { byrealResetPid, byrealPlatformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { AuctionStatus, auctionStruct, commitStatusStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    commitStatusStruct,
    byrealResetPid
  )
    .addFilter('discriminator', [25, 194, 13, 113, 31, 254, 29, 14])
    .addFilter('user', new PublicKey(owner))
    .run();
  if (accounts.length === 0) return [];

  const auctions = await getParsedMultipleAccountsInfo(
    client,
    auctionStruct,
    accounts.map((acc) => acc.auction)
  );
  const registry = new ElementRegistry(NetworkId.solana, byrealPlatformId);

  accounts.forEach((account, index) => {
    const auction = auctions[index];
    if (!auction) return;

    const element = registry.addElementMultiple({
      label: 'Deposit',
      link: `https://www.byreal.io/en/reset?id=${account.auction.toString()}`,
    });

    if (auction.status === AuctionStatus.Closed) return;

    account.bins.forEach((bin) => {
      element.addAsset({
        address: auction.quoteMint,
        amount: bin.commitQuoteTokenAmount.minus(bin.claimedQuoteTokenAmount),
        ref: account.pubkey,
      });
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${byrealPlatformId}-reset`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
