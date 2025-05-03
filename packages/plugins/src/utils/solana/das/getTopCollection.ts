import {PopularCollection} from "../../../plugins/tensor/types";
import { Cache } from '../../../Cache';
import {
  nftCollectionPrefix,
  platformId
} from "../../../plugins/tensor/constants";
import {NetworkId} from "@sonarwatch/portfolio-core";

const tensorTopCollection = new Map<string, PopularCollection>();

export async function getTopCollection(cache: Cache): Promise<Map<string, PopularCollection>> {
  if (tensorTopCollection.size > 0) {
    return tensorTopCollection;
  }

  const cacheCollectionData = await cache.getItem<PopularCollection[]>(platformId, {
    prefix: nftCollectionPrefix,
    networkId: NetworkId.solana,
  });

  cacheCollectionData?.forEach((collection) => {
    tensorTopCollection.set(collection.name || collection.symbol, collection);
  })

  return tensorTopCollection;
}
