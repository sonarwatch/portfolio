import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  nftCollectionPrefix,
  platformId,
  tensorApiBaseURL,
  tensorApiKey
} from './constants';
import { PopularCollection } from "./types";

export const nftSourceTtl = 2 * 60 * 60 * 1000; // 2 hours

const COLLECTIONS_PER_PAGE = 100;
const TOTAL_PAGES = 4;
const DELAY_MS = 500;


// Simple utility for rate-limited API calls
async function fetchWithDelay(url: string, options: RequestInit, delayMs: number = DELAY_MS): Promise<Response> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} ${errorText}`);
  }
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return response;
}

const executor: JobExecutor = async (cache: Cache) => {
  // Fetch all pages of collections with delay between calls
  const pageResults = [];
  for (let i = 0; i < TOTAL_PAGES; i++) {
    const response = await fetchWithDelay(
      `${tensorApiBaseURL}/collections?sortBy=statsV2.volumeAll%3Adesc&limit=${COLLECTIONS_PER_PAGE}&page=${i + 1}`,
      {
        headers: {
          'x-tensor-api-key': tensorApiKey
        } as HeadersInit
      }
    );

    const result = await response.json();
    pageResults.push(result);
  }

  const allCollections = pageResults.flatMap(result => result.collections);

  if (allCollections.length === 0) {
    throw new Error('No collections found in any of the pages');
  }

  // Prepare collection IDs for metadata fetch
  const collIds = allCollections.map(collection => collection.collId);

  // Split collection IDs into batches of 100
  const batches = [];
  for (let i = 0; i < collIds.length; i += COLLECTIONS_PER_PAGE) {
    batches.push(collIds.slice(i, i + COLLECTIONS_PER_PAGE));
  }

  // Fetch metadata for each batch with delay between calls
  const metadataResults = [];
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const response = await fetchWithDelay(
      `${tensorApiBaseURL}/sdk/whitelist_info?collIds=${batch.join('&collIds=')}`,
      {
        headers: {
          'x-tensor-api-key': tensorApiKey
        } as HeadersInit
      }
    );

    const result = await response.json();
    metadataResults.push(result);
  }

  const collectionsMeta = metadataResults.flat();

  if (!collectionsMeta || collectionsMeta.length === 0) {
    throw new Error('No metadata found for collections');
  }

  // Create a map for quick lookup of collection addresses
  const uuidToValueMap = collectionsMeta.reduce((acc, collection) => {
    acc[collection.uuid] = collection.conditions.find((condition: {
      mode: string;
      value: any
    }) => condition.mode === 'VOC')?.value;
    return acc;
  }, {} as Record<string, string>);

  // Transform the data into the desired format
  const collections: PopularCollection[] = allCollections
    .filter((collection) => (uuidToValueMap[collection.collId] || collection.symbol))
    .map((collection) => ({
    collectionId: collection.collId,
    address: uuidToValueMap[collection.collId] || null,
    floorPrice: collection.stats.buyNowPriceNetFees
      ? Number(collection.stats.buyNowPriceNetFees) / 1000000000
      : 0,
    name: collection.name,
    slug: collection.slugDisplay,
    symbol: collection.symbol || '',
    volume: Number(collection.stats.volumeAll) / 1000000000 || 0,
    source: `${platformId}`
  }));

  // Store assets in cache
  await cache.setItem(platformId, collections, {
    prefix: nftCollectionPrefix,
    networkId: NetworkId.solana,
    ttl: nftSourceTtl
  });
};

const job: Job = {
  id: `${platformId}-top-collections`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', 'realtime', NetworkId.solana],
};

export default job; 
