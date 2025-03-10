import {
  collectibleFreezedTag,
  NetworkId,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, nftLendingProgramId, collectionsMemo } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { LoanStatus, nftLoanStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const loans = await ParsedGpa.build(
    client,
    nftLoanStruct,
    nftLendingProgramId
  )
    .addFilter('accountDiscriminator', [20, 195, 70, 117, 165, 227, 182, 1])
    .addFilter('borrower', new PublicKey(owner))
    .run();

  if (!loans.length) return [];

  const [collections, solTokenPrice] = await Promise.all([
    collectionsMemo.getItem(cache),
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
  ]);

  if (!collections.length) throw new Error('Collections not cached');
  if (!solTokenPrice) throw new Error('Sol price not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  loans.forEach((loan) => {
    if (loan.status !== LoanStatus.Ongoing) return;

    const collection = collections.find(
      (c) => c.collectionId === loan.collection
    );
    if (!collection) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: loan.pubkey,
      link: `https://app.rain.fi/dashboard/loans?address=${loan.pubkey}`,
    });

    element.setFixedTerms(false, loan.expiredAt.multipliedBy(1000));

    element.addSuppliedCollectibleAsset({
      address: loan.collateral.toString(),
      collection: {
        name: collection.name,
        floorPrice: new BigNumber(collection.floorPrice)
          .shiftedBy(-solTokenPrice.decimals)
          .multipliedBy(solTokenPrice.price),
        imageUri: collection.metadata.thumbnail,
      },
      attributes: { tags: [collectibleFreezedTag] },
    });

    element.addBorrowedAsset({
      address: loan.principal,
      amount: loan.borrowedAmount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-nft-borrows`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
