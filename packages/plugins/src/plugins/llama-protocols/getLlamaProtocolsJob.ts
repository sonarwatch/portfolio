import { Platform } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { JobExecutor } from '../../Job';
import { LlamaProtocol, LlamaProtocolFull } from './types';
import { shrinkLlamaProtocol } from './helpers';
import { llamaProtocolsCacheKey, llamaProtocolsCachePrefix } from './constants';

const llamaUrl = 'https://api.llama.fi/protocols';

export function getLlamaProtocolsJob(platforms: Platform[]): JobExecutor {
  return async (cache: Cache) => {
    const llamaProtocolsResponse = await axios.get(llamaUrl);
    const platformIdByLlamaId = new Map<string, string>();
    platforms.forEach((platform) => {
      if (!platform.defiLlamaId) return;
      platformIdByLlamaId.set(platform.defiLlamaId, platform.id);
    });

    const protocols: Record<string, LlamaProtocol> = {};
    const llamaProtocols = llamaProtocolsResponse.data as LlamaProtocolFull[];

    for (let i = 0; i < llamaProtocols.length; i++) {
      const llamaProtocol = llamaProtocols[i];
      const platformId = platformIdByLlamaId.get(llamaProtocol.slug);
      if (platformId) {
        protocols[platformId] = shrinkLlamaProtocol(llamaProtocol);
        continue;
      }

      if (!llamaProtocol.parentProtocol) continue;
      const platformId2 = platformIdByLlamaId.get(llamaProtocol.parentProtocol);
      if (platformId2) {
        if (!protocols[platformId2]) {
          protocols[platformId2] = {
            ...shrinkLlamaProtocol(llamaProtocol),
            tvl: 0,
          };
        }
        protocols[platformId2].tvl += llamaProtocol.tvl;
      }
    }
    await cache.setItem(llamaProtocolsCacheKey, JSON.stringify(protocols), {
      prefix: llamaProtocolsCachePrefix,
    });
  };
}
