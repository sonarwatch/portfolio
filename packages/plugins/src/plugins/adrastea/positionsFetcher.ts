import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import {
  jlpPositionsCacheKey,
  jlpToken,
  platformId,
  usdcPositionsCacheKey,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Position } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { usdcSolanaMint } from '../../utils/solana';

const jlpPositionsMemo = new MemoizedCache<Position[]>(jlpPositionsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});
const usdcPositionsMemo = new MemoizedCache<Position[]>(usdcPositionsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const [jlpPositions, usdcPositions] = await Promise.all([
    jlpPositionsMemo.getItem(cache),
    usdcPositionsMemo.getItem(cache),
  ]);

  const jlpPosition = jlpPositions.find((p) => p.owner === owner);
  const usdcPosition = usdcPositions.find((p) => p.owner === owner);

  if (!jlpPosition && !usdcPosition) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  if (jlpPosition) {
    const element = elementRegistry.addElementMultiple({
      label: 'Leverage',
      link: 'https://app.adrastea.fi/leverage-jlp',
    });
    element.addAsset({
      address: jlpToken.toString(),
      amount: jlpPosition.amount,
    });
  }

  if (usdcPosition) {
    const element = elementRegistry.addElementMultiple({
      label: 'Lending',
      link: 'https://app.adrastea.fi/passive-usdc',
    });
    element.addAsset({
      address: usdcSolanaMint.toString(),
      amount: usdcPosition.amount,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
