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
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { LoanStatus, nftLoanStruct, poolStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const pools = await ParsedGpa.build(client, poolStruct, nftLendingProgramId)
    .addFilter('accountDiscriminator', [241, 154, 109, 4, 17, 177, 109, 188])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!pools.length) return [];

  const allNftsLoans = await Promise.all(
    pools.map((pool) =>
      ParsedGpa.build(client, nftLoanStruct, nftLendingProgramId)
        .addFilter('accountDiscriminator', [20, 195, 70, 117, 165, 227, 182, 1])
        .addFilter('pool', pool.pubkey)
        .run()
    )
  );

  if (allNftsLoans.flat().length === 0) return [];

  const [collections, solTokenPrice] = await Promise.all([
    collectionsMemo.getItem(cache),
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
  ]);

  if (!collections.length) throw new Error('Collections not cached');
  if (!solTokenPrice) throw new Error('Sol price not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  pools.forEach((pool, i) => {
    const nftLoans = allNftsLoans[i];

    nftLoans.forEach((loan) => {
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

      element.addBorrowedCollectibleAsset({
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

      element.addSuppliedAsset({
        address: loan.principal,
        amount: loan.borrowedAmount,
      });
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-nft-pools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
