import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
  aprToApy,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, vaultType, marketKey, echelonPackage } from './constants';
import { Market, UserVault } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientAptos } from '../../utils/clients';
import { getAccountResource, getView } from '../../utils/aptos';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();

  const userVault = await getAccountResource<UserVault>(
    client,
    owner,
    vaultType
  );
  if (!userVault) return [];

  const markets = await cache.getItem<Market[]>(marketKey, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });

  if (!markets) return [];

  const [tokenPrices, collateralBalances, liabilityBalances] =
    await Promise.all([
      cache.getTokenPricesAsMap(
        markets.map((market) => market.coinType) as string[],
        NetworkId.aptos
      ),
      await Promise.all(
        userVault.collaterals.data.map((collateral) =>
          getView(client, {
            function: `${echelonPackage}account_coins`,
            functionArguments: [
              owner as `0x${string}`,
              collateral.key.inner as `0x${string}`,
            ],
          }).then((res) => {
            if (!res || !res[0]) return null;
            return res[0] as string;
          })
        )
      ),
      await Promise.all(
        userVault.liabilities.data.map((liability) =>
          getView(client, {
            function: `${echelonPackage}account_liability`,
            functionArguments: [
              owner as `0x${string}`,
              liability.key.inner as `0x${string}`,
            ],
          }).then((res) => {
            if (!res || !res[0]) return null;
            return res[0] as string;
          })
        )
      ),
    ]);

  if (!tokenPrices || tokenPrices.size < 1) return [];

  const marketsAsMap = arrayToMap(markets, 'market');
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  userVault.collaterals.data.forEach((collateral, i) => {
    const market = marketsAsMap.get(collateral.key.inner);
    if (!market) return;
    const tokenPrice = tokenPrices.get(market.coinType);
    if (!tokenPrice) return;
    const collateralBalance = collateralBalances[i];
    if (!collateralBalance || collateralBalance === '0') return;

    suppliedAssets.push(
      tokenPriceToAssetToken(
        market.coinType,
        new BigNumber(collateralBalance)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.aptos,
        tokenPrice
      )
    );

    suppliedYields.push([
      {
        apr: new BigNumber(market.supplyApr).toNumber(),
        apy: aprToApy(new BigNumber(market.supplyApr).toNumber()),
      },
    ]);
  });

  userVault.liabilities.data.forEach((liability, i) => {
    const market = marketsAsMap.get(liability.key.inner);
    if (!market) return;
    const tokenPrice = tokenPrices.get(market.coinType);
    if (!tokenPrice) return;
    const liabilityBalance = liabilityBalances[i];
    if (!liabilityBalance || liabilityBalance === '0') return;

    borrowedAssets.push(
      tokenPriceToAssetToken(
        market.coinType,
        new BigNumber(liabilityBalance)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.aptos,
        tokenPrice
      )
    );

    borrowedYields.push([
      {
        apr: new BigNumber(market.borrowApr).toNumber(),
        apy: aprToApy(new BigNumber(market.borrowApr).toNumber()),
      },
    ]);
  });

  const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
    getElementLendingValues({
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
    });

  const element: PortfolioElement = {
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.aptos,
    platformId,
    label: 'Lending',
    value,
    data: {
      borrowedAssets,
      borrowedValue,
      borrowedYields,
      suppliedAssets,
      suppliedValue,
      suppliedYields,
      healthRatio,
      rewardAssets,
      rewardValue,
      value,
    },
  };

  return [element];
  /*
  if (
    vault.supply_coins.length === 0 &&
    vault.borrow_coins.length === 0
  )
    return [];

  const configStores = await cache.getItem<ConfigStores>(configStoresKey, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });
  if (!configStores) return [];

  const supplyPositions =
    vault.supply_coins.length === 0
      ? []
      : await getTableItemsByKeys<SupplyPosition>(
          client,
          vault.supply_position.handle,
          vault.supply_coins,
          '0x1::string::String',
          supplyPositionType
        );
  const borrowPositions =
    vault.borrow_coins.length === 0
      ? []
      : await getTableItemsByKeys<BorrowPosition>(
          client,
          vault.borrow_position.handle,
          vault.borrow_coins,
          '0x1::string::String',
          borrowPositionType
        );


  // Token prices
  const tokenPricesRes = await cache.getTokenPrices(
    [...vault.supply_coins, ...vault.borrow_coins],
    NetworkId.aptos
  );
  const tokenPrices: Record<string, TokenPrice> = {};
  tokenPricesRes.forEach((tp) => {
    if (!tp) return;
    tokenPrices[tp?.address] = tp;
  });

  for (let i = 0; i < supplyPositions.length; i++) {
    const supplyPosition = supplyPositions[i];
    if (!supplyPosition) continue;
    if (supplyPosition.amount === '0') continue;

    const coinType = vault.supply_coins[i];
    const address = formatTokenAddress(coinType, NetworkId.aptos);
    const { decimals, ltv } = configStores[coinType];
    const amount = new BigNumber(supplyPosition.amount)
      .div(10 ** decimals)
      .toNumber();

    suppliedAssets.push(
      tokenPriceToAssetToken(
        coinType,
        amount,
        NetworkId.aptos,
        tokenPrices[address] || undefined
      )
    );
    suppliedLtvs.push(supplyPosition.collateral ? ltv / 100 : 0);
    suppliedYields.push([]);
  }

  for (let i = 0; i < borrowPositions.length; i++) {
    const borrowPosition = borrowPositions[i];
    if (!borrowPosition) continue;
    if (borrowPosition.amount === '0') continue;

    const coinType = vault.borrow_coins[i];
    const address = formatTokenAddress(coinType, NetworkId.aptos);
    const { decimals } = configStores[coinType];
    const amount = new BigNumber(borrowPosition.amount)
      .div(10 ** decimals)
      .toNumber();

    borrowedAssets.push(
      tokenPriceToAssetToken(
        coinType,
        amount,
        NetworkId.aptos,
        tokenPrices[address] || undefined
      )
    );
    borrowedYields.push([]);
  }
 */
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
