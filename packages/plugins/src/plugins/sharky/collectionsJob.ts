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
  sharkyIdlItem,
} from './constants';
import { Collection, nftListStruct, OrderBook } from './types';
import {
  getAutoParsedProgramAccounts,
  getParsedMultipleAccountsInfo,
  u8ArrayToString,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';

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
    getAutoParsedProgramAccounts<OrderBook>(connection, sharkyIdlItem, [
      {
        dataSize: orderBookDataSize,
      },
    ]),
  ]);

  if (!floorPrices.data || !orderBooks) return;

  const nftLists = await getParsedMultipleAccountsInfo(
    connection,
    nftListStruct,
    orderBooks.map((ob) => new PublicKey(ob.orderBookType.nftList.listAccount)),
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
    if (!orderBook || !orderBook.orderBookType.nftList.listAccount) return;
    const collectionName = collectionNamesAsMap.get(
      orderBook.orderBookType.nftList.listAccount
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
  executor,
  labels: ['normal'],
};
export default job;
