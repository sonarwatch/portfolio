import {
  NetworkId,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { platformId, newApi } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Games } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { usdcSolanaMint } from '../../utils/solana';

const tokenMap = new Map([
  ['usdc', usdcSolanaMint],
  ['sol', solanaNativeWrappedAddress],
  ['bonk', 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'],
]);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const apiKey = process.env['PORTFOLIO_MOONWALK_API_BEARER'];
  if (!apiKey) return [];

  const apiResponse: AxiosResponse<Games> = await axios.get(newApi + owner, {
    timeout: 3000,
    headers: {
      'X-API-KEY': apiKey,
    },
  });
  if (!apiResponse.data) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  for (const game of apiResponse.data) {
    const element = registry.addElementMultiple({
      label: 'Deposit',
      name: game.game,
    });
    const token = tokenMap.get(game.token);
    if (token) {
      element.addAsset({
        address: token,
        amount: game.claimable,
        alreadyShifted: true,
        attributes: { isClaimable: true },
      });
      element.addAsset({
        address: token,
        amount: game.locked,
        alreadyShifted: true,
        attributes: { lockedUntil: game.end * 1000 },
      });
    }
    for (const sponsor of game.sponsors) {
      element.addAsset({
        address: sponsor.token,
        amount: sponsor.claimable,
        alreadyShifted: true,
        attributes: { isClaimable: true },
      });
    }
  }
  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-games`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
