import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  collectionsCacheKey,
  orderBookDataSize,
  platformId,
  sharkyProgram,
} from './constants';
import {
  getParsedMultipleAccountsInfo,
  u8ArrayToString,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { nftListStruct, orderBookStruct } from './structs';
import { Collection } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const [floorPrices, orderBooks] = await Promise.all([
    axios
      .get(`https://sharky.fi/api/floor-prices`, {
        timeout: 5000,
      })
      .catch((err) => {
        throw Error(`SHARKY_API ERR: ${err}`);
      }),
    ParsedGpa.build(connection, orderBookStruct, sharkyProgram)
      .addDataSizeFilter(orderBookDataSize)
      .run(),
  ]);

  if (!floorPrices.data || !orderBooks) return;

  const nftLists = await getParsedMultipleAccountsInfo(
    connection,
    nftListStruct,
    orderBooks.map((ob) => new PublicKey(ob.orderBookType.collectionKey)),
    {
      dataSlice: { offset: 0, length: 231 },
    }
  );

  const collectionNamesAsMap: Map<string, string> = new Map();
  nftLists.forEach((nftList) => {
    if (!nftList || !nftList.collectionName) return;
    collectionNamesAsMap.set(
      nftList.pubkey.toString(),
      u8ArrayToString(nftList.collectionName)
    );
  });

  const collections: Collection[] = [];

  orderBooks.forEach((orderBook) => {
    if (!orderBook || !orderBook.orderBookType.collectionKey) return;
    const collectionName = collectionNamesAsMap.get(
      orderBook.orderBookType.collectionKey.toString()
    );
    if (!collectionName) return;
    collections.push({
      orderBook: orderBook.pubkey.toString(),
      name: collectionName,
      floor: floorPrices.data.floorPrices[collectionName]?.floorPriceSol,
      tensor_id: floorPrices.data.floorPrices[collectionName]?.tensor?.slug,
    });
  });

  await cache.setItem(collectionsCacheKey, collections, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-collections`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
