import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  platformId,
  marketKey,
  addressKey,
  addressPrefix
} from './constants';
import { AddressInfo, Core } from "./types";
import type { BalanceSheet, Coin, CoinNames, MarketData } from "./types";
import { getObjectFields } from "@mysten/sui.js";

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const addressData = await cache.getItem<AddressInfo>(marketKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui,
  });

  if (!addressData) return {};

  // ['cetus', 'apt', ...]
  const pools: {[k in CoinNames]: Coin} = (addressData.mainnet.core as Core).coins;
  const marketId: string = (addressData.mainnet.core as Core).market;

  // get market data
  const marketObject = await client.getObject({
    id: marketId,
    options: {
      showContent: true
    }
  });

  // get balance sheet
  const balanceSheets: BalanceSheet = {};
  const marketData = getObjectFields(marketObject) as MarketData;
  const balanceSheetParentId = marketData.vault.fields.balance_sheets.fields
    .table.fields.id.id;

  for(const coinName of Object.keys(pools)) {
    balanceSheets[coinName] = getObjectFields(await client.getDynamicFieldObject({
      parentId: balanceSheetParentId,
      name: {
        type: '0x1::type_name::TypeName',
        value: {
          name: COIN_TYPES
        }
      }
    }))
  }

  const job: Job = {
    id: `${platformId}-market`,
    executor,
  };
  export default job;
