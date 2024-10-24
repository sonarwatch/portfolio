import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, strategies, strategiesCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { PositionInfo, positionInfoStruct, Strategy } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const positionInfos = await Promise.all(
    strategies.map((strategy) =>
      getParsedProgramAccounts<PositionInfo>(
        connection,
        positionInfoStruct,
        new PublicKey(strategy),
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

  const strategiesInfo = await cache.getItem<Strategy[]>(strategiesCacheKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  if (!strategiesInfo) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  positionInfos.forEach((positionInfo, i) => {
    if (
      positionInfo[0] &&
      !positionInfo[0].liquidated &&
      !positionInfo[0].closed
    ) {
      const element = elementRegistry.addElementBorrowlend({
        label: 'Leverage',
      });

      element.addSuppliedAsset({
        address: strategiesInfo[i].token_mint,
        amount: positionInfo[0].position_amount,
      });
      element.addBorrowedAsset({
        address: strategiesInfo[i].collateral_mint,
        amount: positionInfo[0].leverage_amount,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-strategy`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
