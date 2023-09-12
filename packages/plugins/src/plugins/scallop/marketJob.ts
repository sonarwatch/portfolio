import { NetworkId } from '@sonarwatch/portfolio-core';
import { getObjectFields } from "@mysten/sui.js";
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  platformId,
  marketKey,
  addressPrefix,
  marketPrefix as prefix,
  addressKey
} from './constants';
import { AddressInfo, Core } from "./types";
import type { BalanceSheet, BorrowIndexes, InterestModel, MarketData } from "./types";
import { getCoinTypeMetadataHelper } from "./helpers";

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const addressData = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui,
  });

  if (!addressData) return;

  // ['cetus', 'apt', ...]
  const pools = await getCoinTypeMetadataHelper(addressData);
  const marketId: string = (addressData.mainnet.core as Core).market;

  // get market data
  const marketObject = await client.getObject({
    id: marketId,
    options: {
      showContent: true
    }
  });
  const marketData = getObjectFields(marketObject) as MarketData;

  // get balance sheet
  const balanceSheets: BalanceSheet = {};
  const balanceSheetParentId = marketData.vault.fields.balance_sheets.fields
    .table.fields.id.id;
  for (const coinName of Object.keys(pools)) {
    balanceSheets[coinName] = getObjectFields(await client.getDynamicFieldObject({
      parentId: balanceSheetParentId,
      name: {
        type: '0x1::type_name::TypeName',
        value: {
          name: pools[coinName].coinType.substring(2)
        }
      }
    }));
  }

  // get borrow indexes
  const borrowIndexes: BorrowIndexes = {};
  const borrowIndexesParentId = marketData.borrow_dynamics.fields.table.fields.id.id;
  for (const coinName of Object.keys(pools)) {
    borrowIndexes[coinName] = getObjectFields(await client.getDynamicFieldObject({
      parentId: borrowIndexesParentId,
      name: {
        type: '0x1::type_name::TypeName',
        value: {
          name: pools[coinName].coinType.substring(2)
        }
      }
    }));
  }

  // get interest models
  const interestModels: InterestModel = {};
  const interestModelsParentId = marketData.interest_models.fields.table.fields.id.id;
  for(const coinName of Object.keys(pools)) {
    interestModels[coinName] = getObjectFields(await client.getDynamicFieldObject({
      parentId: interestModelsParentId,
      name: {
        type: '0x1::type_name::TypeName',
        value: {
          name: pools[coinName].coinType.substring(2)
        }
      }
    }))
  }

  await cache.setItem(
    marketKey,
    {
      balanceSheets,
      borrowIndexes,
      interestModels,
    },
    {
      prefix,
      networkId: NetworkId.sui
    }
  );
};

const job: Job = {
  id: `${platformId}-market`,
  executor,
};

export default job;
