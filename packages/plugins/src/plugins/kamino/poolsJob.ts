import {
  NetworkId,
  TokenPrice,
  getTokenPricesUnderlyingsFromTokensPrices,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { programId, platformId } from './constants';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../utils/solana';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import {
  DEXS,
  getPoolStructFromDex,
  getPositionStructFromDex,
  getTokenAmountsFromInfos,
  isActive,
} from './helpers/vaults';

import { whirlpoolStrategyStruct } from './structs/vaults';
import { dataStructSizeFilter } from '../../utils/solana/filters';
import { binArrayStruct } from '../meteora/dlmm/structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const strategies = await getParsedProgramAccounts(
    client,
    whirlpoolStrategyStruct,
    programId,
    dataStructSizeFilter(whirlpoolStrategyStruct)
  );

  const tokensMint = strategies
    .map((str) => [str.tokenAMint.toString(), str.tokenBMint.toString()])
    .flat();

  const tokenPrices = await cache.getTokenPrices(tokensMint, NetworkId.solana);

  const tokenPriceByAddress: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tP) =>
    tP ? tokenPriceByAddress.set(tP.address, tP) : undefined
  );

  const positions = strategies.map((strategy) => strategy.position);
  const pools = strategies.map((strategy) => strategy.pool);

  const strategiesPositionsAndWhirlpool = [];
  strategiesPositionsAndWhirlpool.push(...positions, ...pools);

  const positionSizeIndex = positions.length;
  const positionAndWhirlpoolAccountsInfo = await getMultipleAccountsInfoSafe(
    client,
    strategiesPositionsAndWhirlpool
  );

  for (let i = 0; i < strategies.length; i += 1) {
    const strategy = strategies[i];
    if (!isActive(strategy)) continue;
    const { strategyDex } = strategy;

    // Here is a Kamino error.
    // They've tested a pool with 11111111111111111111111111111111 for whirlpool
    if (pools[i].toString() === '11111111111111111111111111111111') continue;

    const tokenPriceA = tokenPriceByAddress.get(strategy.tokenAMint.toString());
    const tokenPriceB = tokenPriceByAddress.get(strategy.tokenBMint.toString());
    if (!tokenPriceA || !tokenPriceB) continue;

    const address = strategy.sharesMint;
    const decimals = strategy.sharesMintDecimals.toNumber();
    const supply = strategy.sharesIssued.dividedBy(10 ** decimals);

    const rawPool = positionAndWhirlpoolAccountsInfo[positionSizeIndex + i];
    if (!rawPool) continue;

    const rawPoolData = rawPool.data;
    const pool = getPoolStructFromDex(strategyDex)?.deserialize(rawPoolData)[0];
    if (!pool) continue;

    const rawPosition = positionAndWhirlpoolAccountsInfo[i];
    if (!rawPosition) continue;

    const positionData = rawPosition.data;
    const position =
      getPositionStructFromDex(strategyDex)?.deserialize(positionData)[0];
    if (!position) continue;

    const isMeteroa = strategyDex.toNumber() === DEXS.METEORA;
    const binArrays = isMeteroa
      ? (
          await getParsedMultipleAccountsInfo(client, binArrayStruct, [
            strategy.tickArrayLower,
            strategy.tickArrayUpper,
          ])
        )
          .map((account) => account || [])
          .flat()
      : undefined;

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromInfos(
      strategy,
      pool,
      position,
      binArrays
    );

    const tokenAAmount = tokenAmountA
      .plus(strategy.tokenAAmounts)
      .div(10 ** strategy.tokenAMintDecimals.toNumber());
    const tokenBAmount = tokenAmountB
      .plus(strategy.tokenBAmounts)
      .div(10 ** strategy.tokenBMintDecimals.toNumber());

    const tokenALocked = tokenAAmount.multipliedBy(tokenPriceA.price);
    const tokenBLocked = tokenBAmount.multipliedBy(tokenPriceB.price);
    const tvl = tokenALocked.plus(tokenBLocked);
    if (tvl.isLessThan(5)) continue;

    const price = tvl.dividedBy(supply).toNumber();

    const underlyings = getTokenPricesUnderlyingsFromTokensPrices(
      [tokenPriceA, tokenPriceB],
      [
        tokenAAmount.dividedBy(supply).toNumber(),
        tokenBAmount.dividedBy(supply).toNumber(),
      ]
    );

    await cache.setTokenPriceSource({
      address: address.toString(),
      decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Vault',
      underlyings,
    });
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
