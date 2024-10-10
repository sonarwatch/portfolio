import { Transaction } from '@mysten/sui/transactions';
import {
  formatMoveTokenAddress,
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, dataKey, vaultsPrefix, positionsKey } from './constants';
import { getClientSui } from '../../utils/clients';
import { BorrowingInterest, Farm, MoleData, PositionSummary } from './types';
import { serializeReturnValue } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const elements: PortfolioElement[] = [];

  const [data, positions] = await Promise.all([
    cache.getItem<MoleData>(dataKey, {
      prefix: vaultsPrefix,
      networkId: NetworkId.sui,
    }),
    cache.getItem<PositionSummary[]>(positionsKey, {
      prefix: vaultsPrefix,
      networkId: NetworkId.sui,
    }),
  ]);

  if (!data || !data.farms || !data.vaults || !data.others || !positions)
    return [];

  const coinsTypes: string[] = data.vaults.map((v) =>
    formatMoveTokenAddress(v.baseToken)
  );
  const tokenPrices: Map<string, TokenPrice> = await cache.getTokenPricesAsMap(
    coinsTypes,
    NetworkId.sui
  );

  const myPositions = positions.filter((position) => position.owner === owner);

  if (myPositions.length === 0) return [];

  await Promise.all(
    myPositions.map(async (position) => {
      const positionId = position.id;
      const positionWorker = position.worker;

      let farm: Farm | undefined;
      let borrowingInterest: BorrowingInterest | undefined;

      data.farms.forEach((f) => {
        f.borrowingInterests.forEach((b) => {
          if (b.address === positionWorker) {
            farm = f;
            borrowingInterest = b;
          }
        });
      });

      if (!farm || !borrowingInterest) {
        return;
      }

      const packageObjectId = borrowingInterest.upgradeAddr;
      const module = 'cetus_clmm_worker';
      const func = borrowingInterest.isReverse
        ? 'position_info_reverse'
        : 'position_info';

      const tx = new Transaction();

      tx.moveCall({
        target: `${packageObjectId}::${module}::${func}`,
        arguments: [
          tx.object(borrowingInterest.workerInfo),
          tx.object(data.others.globalStorage),
          tx.object(borrowingInterest.pool),
          tx.pure.u64(positionId),
        ],
        typeArguments: [
          borrowingInterest.isReverse
            ? farm.symbol1Address
            : farm.symbol2Address, // baseCoinType
          borrowingInterest.isReverse
            ? farm.symbol2Address
            : farm.symbol1Address, // farmingCoinType
          farm.lpAddress,
        ],
      });

      const dir = await client.devInspectTransactionBlock({
        sender:
          '0x7ca96e9760a722923f94e692faa26806b311565dbbfb707ed4f9fc1e336f2c73',
        transactionBlock: tx,
      });

      if (!dir.results || !dir.results[0].returnValues) return;

      const borrowedAssets: PortfolioAsset[] = [];
      const borrowedYields: Yield[][] = [];
      const suppliedAssets: PortfolioAsset[] = [];
      const suppliedYields: Yield[][] = [];
      const rewardAssets: PortfolioAsset[] = [];

      const health = new BigNumber(
        serializeReturnValue(dir.results[0].returnValues[0])
      ).dividedBy(
        10 **
          (borrowingInterest.isReverse
            ? farm.symbol1Decimals
            : farm.symbol2Decimals)
      );
      const debtValue = new BigNumber(
        serializeReturnValue(dir.results[0].returnValues[1])
      ).dividedBy(
        10 **
          (borrowingInterest.isReverse
            ? farm.symbol1Decimals
            : farm.symbol2Decimals)
      );
      if (health.isZero() && debtValue.isZero()) return;

      // const equityValue = health.minus(debtValue);
      // const leverage = health.dividedBy(equityValue);
      // const debtRatio = debtValue.dividedBy(health);

      if (borrowingInterest.isReverse) {
        if (!health.isZero())
          suppliedAssets.push(
            tokenPriceToAssetToken(
              farm.symbol1Address,
              health.toNumber(),
              NetworkId.sui,
              tokenPrices.get(formatMoveTokenAddress(farm.symbol1Address))
            )
          );

        if (!debtValue.isZero())
          borrowedAssets.push(
            tokenPriceToAssetToken(
              farm.symbol1Address,
              debtValue.toNumber(),
              NetworkId.sui,
              tokenPrices.get(formatMoveTokenAddress(farm.symbol1Address))
            )
          );
      } else {
        if (!health.isZero())
          suppliedAssets.push(
            tokenPriceToAssetToken(
              farm.symbol2Address,
              health.toNumber(),
              NetworkId.sui,
              tokenPrices.get(formatMoveTokenAddress(farm.symbol2Address))
            )
          );

        if (!debtValue.isZero())
          borrowedAssets.push(
            tokenPriceToAssetToken(
              farm.symbol2Address,
              debtValue.toNumber(),
              NetworkId.sui,
              tokenPrices.get(formatMoveTokenAddress(farm.symbol2Address))
            )
          );
      }

      if (
        borrowedAssets.length === 0 &&
        suppliedAssets.length === 0 &&
        rewardAssets.length === 0
      )
        return;

      const { borrowedValue, suppliedValue, value, rewardValue } =
        getElementLendingValues({
          suppliedAssets,
          borrowedAssets,
          rewardAssets,
        });

      elements.push({
        type: PortfolioElementType.borrowlend,
        networkId: NetworkId.sui,
        platformId,
        label: 'Farming',
        name: `${farm.sourceName} #${positionId}`,
        value,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields,
          suppliedAssets,
          suppliedValue,
          suppliedYields,
          healthRatio: debtValue.dividedBy(health).toNumber(),
          rewardAssets,
          rewardValue,
          value,
        },
      });
    })
  );

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
