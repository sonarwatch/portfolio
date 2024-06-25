import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { oracleToMintLocal } from './constants';
import { oracleToMintKey, platformId } from '../constants';

const map: Map<string, string> = new Map();
let lastUpdate = 0;
const ttl = 3600000;

export async function getMintFromOracle(
  oracle: string,
  cache: Cache
): Promise<string | null> {
  if (lastUpdate < Date.now() - ttl) {
    oracleToMintLocal.forEach(([cOracle, cMint]) => {
      map.set(cOracle, cMint);
    });
    const cachedOracleToMint = await cache.getItem<[string, string][]>(
      oracleToMintKey,
      {
        prefix: platformId,
        networkId: NetworkId.solana,
      }
    );
    if (cachedOracleToMint) {
      cachedOracleToMint.forEach(([cOracle, cMint]) => {
        map.set(cOracle, cMint);
      });
    }
    lastUpdate = Date.now();
  }

  return map.get(oracle) || null;
}
