import { TransactionBlock } from '@mysten/sui.js/transactions';
import {
  getUsdValueSum,
  NetworkId, PortfolioAsset,
  PortfolioElement, PortfolioElementType, PortfolioLiquidity
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  dataKey,
  vaultsPrefix, positionsKey
} from './constants';
import { getClientSui } from '../../utils/clients';
import { BorrowingInterest, Farm, MoleData, PositionSummary } from './types';
import { serializeReturnValue } from './helpers';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

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

  if (!data || !data.farms || !data.vaults || !data.others || ! positions)
    return [];

  const myPositions = positions.filter(position => position.owner === owner);

  if (myPositions.length === 0)
    return [];

  const liquidities: PortfolioLiquidity[] = [];

  await Promise.all(myPositions.map(async position => {
    const positionId = position.id;
    const positionWorker = position.worker;

    let farm: Farm | undefined;
    let borrowingInterest: BorrowingInterest | undefined;

    data.farms.forEach(f => {
      f.borrowingInterests.forEach((b) => {
        if (b.address === positionWorker) {
          farm = f;
          borrowingInterest = b;
        }
      })
    });

    if (!farm || !borrowingInterest) {
      return;
    }

    const packageObjectId = borrowingInterest.upgradeAddr;
    const module = 'cetus_clmm_worker';
    const func = borrowingInterest.isReverse ? 'position_info_reverse' : 'position_info';

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageObjectId}::${module}::${func}`,
      arguments: [
        tx.object(borrowingInterest.workerInfo),
        tx.object(data.others.globalStorage),
        tx.object(borrowingInterest.pool),
        tx.pure(positionId)
      ],
      typeArguments: [
        borrowingInterest.isReverse ? farm.symbol1Address : farm.symbol2Address, // baseCoinType
        borrowingInterest.isReverse ? farm.symbol2Address : farm.symbol1Address, // farmingCoinType
        farm.lpAddress,
      ]
    });

    const dir = await client.devInspectTransactionBlock({
      sender: '0x7ca96e9760a722923f94e692faa26806b311565dbbfb707ed4f9fc1e336f2c73',
      transactionBlock: tx
    });

    if (!dir.results || !dir.results[0].returnValues)
      return;

    const health = new BigNumber(serializeReturnValue(dir.results[0].returnValues[0])).dividedBy(10 ** (borrowingInterest.isReverse ? farm.symbol1Decimals : farm.symbol2Decimals));
    const debtValue = new BigNumber(serializeReturnValue(dir.results[0].returnValues[1])).dividedBy(10 ** (borrowingInterest.isReverse ? farm.symbol1Decimals : farm.symbol2Decimals));
    const equityValue = health.minus(debtValue);
    // const leverage = health.dividedBy(equityValue);
    // const debtRatio = debtValue.dividedBy(health);

    const assets: PortfolioAsset[] = [];

    assets.push(
      ...tokenPriceToAssetTokens(
        farm.symbol1Address,
        borrowingInterest.isReverse ? equityValue.toNumber() : 0,
        NetworkId.sui
      )
    );

    assets.push(
      ...tokenPriceToAssetTokens(
        farm.symbol2Address,
        borrowingInterest.isReverse ? 0 : equityValue.toNumber(),
        NetworkId.sui
      )
    );

    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const value = assetsValue;

    liquidities.push({
      value,
      assets,
      assetsValue,
      rewardAssets: [],
      rewardAssetsValue: null,
      yields: [],
    });
  }));

  if (liquidities.length === 0) return [];

  elements.push({
    networkId: NetworkId.sui,
    platformId,
    type: PortfolioElementType.liquidity,
    label: 'Leverage',
    value: getUsdValueSum(liquidities.map((l) => l.value)),
    data: {
      liquidities,
    },
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
