import { formatTokenAddress, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  marketKey,
  echelonLendingPackage,
  marketType,
} from './constants';
import { getClientAptos } from '../../utils/clients';
import { getAccountResource, getView } from '../../utils/aptos';
import { LendingMarket, Market } from './types';
import { fp64ToFloat } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();

  const marketsResult = await getView(client, {
    function:
      '0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::lending::market_objects',
  });

  if (!marketsResult) return;

  const marketsIds = (marketsResult[0] as { inner: string }[]).map(
    (o) => o.inner
  );

  const markets: Market[] = await Promise.all(
    marketsIds.map(async (market) => {
      const [borrowApr, supplyApr, coinType, lendingMarket] = await Promise.all(
        [
          getView(client, {
            function: `${echelonLendingPackage}borrow_interest_rate`,
            functionArguments: [market as `0x${string}`],
          }).then((res) => {
            if (!res || !res[0]) {
              return null;
            }
            const r = res[0] as { v: string };
            return fp64ToFloat(BigInt(r.v)) * 100;
          }),
          getView(client, {
            function: `${echelonLendingPackage}supply_interest_rate`,
            functionArguments: [market as `0x${string}`],
          }).then((res) => {
            if (!res || !res[0]) {
              return null;
            }
            const r = res[0] as { v: string };
            return fp64ToFloat(BigInt(r.v)) * 100;
          }),
          getView(client, {
            function: `${echelonLendingPackage}market_coin`,
            functionArguments: [market as `0x${string}`],
          }).then((res) => {
            if (!res || !res[0]) {
              return null;
            }
            return formatTokenAddress(res[0] as string, NetworkId.aptos);
          }),
          getAccountResource<LendingMarket>(client, market, marketType),
        ]
      );

      return {
        market,
        asset_name: lendingMarket?.asset_name,
        borrowApr,
        supplyApr,
        coinType,
        collateralFactor: lendingMarket
          ? Number(lendingMarket.collateral_factor_bps) / 1e4
          : null,
      } as Market;
    })
  );

  await cache.setItem(marketKey, markets, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });
};
const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
