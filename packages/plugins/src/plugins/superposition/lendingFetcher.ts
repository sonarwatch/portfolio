import { NetworkId } from '@sonarwatch/portfolio-core';
import { collateralPositionType, platformId, portfolioType } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientAptos } from '../../utils/clients';
import { Portfolio } from './types';
import { getAccountResource, getTableItemsByKeys } from '../../utils/aptos';

const executor: FetcherExecutor = async (owner: string) => {
  const client = getClientAptos();
  const poolPositions = await getAccountResource<Portfolio>(
    client,
    owner,
    portfolioType
  );
  if (!poolPositions) return [];
  if (
    poolPositions.collaterals.items.length === 0 &&
    poolPositions.liabilities.items.length === 0
  )
    return [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const supplyPositions =
    poolPositions.collaterals.items.length === 0
      ? []
      : await getTableItemsByKeys<any>(
          client,
          poolPositions.collaterals.indexes.handle,
          ['0x1::aptos_coin::AptosCoin'],
          '0x1::string::String',
          collateralPositionType
        );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const supplyPositions2 =
    poolPositions.collaterals.items.length === 0
      ? []
      : await getTableItemsByKeys<any>(
          client,
          poolPositions.collaterals.keys.item_table.handle,
          ['0x1::aptos_coin::AptosCoin'],
          '0x1::string::String',
          collateralPositionType
        );

  return [];
};

const fetcher: Fetcher = {
  id: `${platformId}-lending`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
