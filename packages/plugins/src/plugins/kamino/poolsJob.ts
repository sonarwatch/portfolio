import {
  NetworkId,
  TokenPrice,
  getTokenPricesUnderlyingsFromTokensPrices,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { platformId, programId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import { dexToNumber, getTokenAmountsFromInfos, isActive } from './helpers';
import { positionStruct, whirlpoolStruct } from '../orca/structs/whirlpool';
import {
  personalPositionStateStruct,
  poolStateStruct,
} from '../raydium/structs/clmms';
import { whirlpoolStrategyStruct } from './structs';
import { dataSizeFilter } from '../../utils/solana/filters';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const strategies = await getParsedProgramAccounts(
    client,
    whirlpoolStrategyStruct,
    programId,
    dataSizeFilter(whirlpoolStrategyStruct)
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

    // Here is a Kamino error.
    // They've tested a pool with 11111111111111111111111111111111 for whirlpool
    if (pools[i].toString() === '11111111111111111111111111111111') continue;

    const tokenPriceA = tokenPriceByAddress.get(strategy.tokenAMint.toString());
    const tokenPriceB = tokenPriceByAddress.get(strategy.tokenBMint.toString());
    if (!tokenPriceA || !tokenPriceB) continue;

    const address = strategy.sharesMint;
    const lpSupplyAndDecimals = await fetchTokenSupplyAndDecimals(
      address,
      client,
      0
    );
    if (!lpSupplyAndDecimals) continue;
    const { supply } = lpSupplyAndDecimals;
    const { decimals } = lpSupplyAndDecimals;

    const isOrca = strategy.strategyDex.toNumber() === dexToNumber('ORCA');

    const rawPool = positionAndWhirlpoolAccountsInfo[positionSizeIndex + i];
    if (!rawPool) continue;

    const rawPoolData = rawPool.data;
    const pool = isOrca
      ? whirlpoolStruct.deserialize(rawPoolData)[0]
      : poolStateStruct.deserialize(rawPoolData)[0];

    const rawPosition = positionAndWhirlpoolAccountsInfo[i];
    if (!rawPosition) continue;

    const positionData = rawPosition.data;
    const position = isOrca
      ? positionStruct.deserialize(positionData)[0]
      : personalPositionStateStruct.deserialize(positionData)[0];

    const { tokenAmountB, tokenAmountA } = getTokenAmountsFromInfos(
      strategy,
      pool,
      position
    );

    const tokenAAmount = tokenAmountB
      .div(10 ** tokenPriceA.decimals)
      .toNumber();
    const tokenBAmount = tokenAmountA
      .div(10 ** tokenPriceB.decimals)
      .toNumber();

    const tokenALocked = tokenAAmount * tokenPriceA.price;
    const tokenBLocked = tokenBAmount * tokenPriceB.price;

    const tvl = tokenALocked + tokenBLocked;
    if (tvl <= 5) continue;

    const price = tvl / supply;

    const underlyings = getTokenPricesUnderlyingsFromTokensPrices(
      [tokenPriceA, tokenPriceB],
      [tokenAAmount / supply, tokenBAmount / supply]
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
  executor,
};
export default job;
