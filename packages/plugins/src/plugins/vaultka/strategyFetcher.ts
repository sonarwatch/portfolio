import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, strategies, strategiesCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import {
  LstPositionInfo,
  LstStrategy,
  PositionInfo,
  Strategy,
} from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const positionInfos = await Promise.all(
    strategies.map((strategy) =>
      getParsedProgramAccounts<PositionInfo | LstPositionInfo>(
        connection,
        strategy.positionInfoStruct,
        new PublicKey(strategy.pubkey),
        [
          {
            memcmp: {
              offset: 24,
              bytes: owner,
            },
          },
        ]
      )
    )
  );

  if (!positionInfos || positionInfos.filter((u) => u !== null).length === 0)
    return [];

  const strategiesInfo = await cache.getItem<
    ParsedAccount<Strategy | LstStrategy>[]
  >(strategiesCacheKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!strategiesInfo) throw new Error('Strategies not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  positionInfos.forEach((positionInfo, i) => {
    if (
      positionInfo[0] &&
      !positionInfo[0].liquidated &&
      !positionInfo[0].closed
    ) {
      const strategy = strategiesInfo[i];

      const element = elementRegistry.addElementBorrowlend({
        label: 'Leverage',
        link: 'https://solana.vaultka.com/leverage',
        ref: positionInfo[0].pubkey,
        sourceRefs: [{ name: 'Strategy', address: strategy.pubkey.toString() }],
      });

      let borrowMint;
      if (isLstStrategy(strategy)) {
        borrowMint = strategy.collateral_mint;
      } else {
        borrowMint = strategy.borrow_mint;
      }

      element.addSuppliedAsset({
        address: strategy.collateral_mint,
        amount: positionInfo[0].position_amount,
      });
      element.addBorrowedAsset({
        address: borrowMint,
        amount: positionInfo[0].leverage_amount,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

function isLstStrategy(
  strategy: Strategy | LstStrategy
): strategy is LstStrategy {
  return !('borrow_mint' in strategy);
}

const fetcher: Fetcher = {
  id: `${platformId}-strategy`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
