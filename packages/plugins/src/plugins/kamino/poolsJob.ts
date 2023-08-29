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
import { dataSizeStructFilter } from '../orders/clobs-solana/filters';
import { whirlpoolPositionStruct } from './structs';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import { dexToNumber, getTokenAmountsFromInfos } from './helpers';
import { positionStruct, whirlpoolStruct } from '../orca/structs/whirlpool';
import {
  personalPositionStateStruct,
  poolStateStruct,
} from '../raydium/structs/clmms';
// import { whirlpoolStrategyStruct } from '.';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const strategies = await getParsedProgramAccounts(
    client,
    whirlpoolPositionStruct,
    programId,
    dataSizeStructFilter(whirlpoolPositionStruct)
  );

  const tokensMint = strategies
    .map((str) => [str.tokenAMint.toString(), str.tokenBMint.toString()])
    .flat();

  const tokenPrices = await cache.getTokenPrices(tokensMint, NetworkId.solana);

  const tokenPriceByAddress: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tP) =>
    tP ? tokenPriceByAddress.set(tP.address, tP) : undefined
  );

  const strategiesPositions = strategies.map((pool) => pool.position);
  const strategiesWhirlpool = strategies.map((pool) => pool.whirlpool);

  const strategiesPositionsAndWhirlpool = [];
  strategiesPositionsAndWhirlpool.push(
    ...strategiesPositions,
    ...strategiesWhirlpool
  );

  const positionSizeIndex = strategiesPositions.length;
  const positionAndWhirlpoolAccountsInfo = await getMultipleAccountsInfoSafe(
    client,
    strategiesPositionsAndWhirlpool
  );

  for (let i = 0; i < strategies.length; i += 1) {
    const strategy = strategies[i];

    // Here is a Kamino error.
    // They've tested a pool with 11111111111111111111111111111111 for whirlpool
    if (
      strategiesWhirlpool[i].toString() === '11111111111111111111111111111111'
    )
      continue;

    const tokenPriceA = tokenPriceByAddress.get(strategy.tokenAMint.toString());
    const tokenPriceB = tokenPriceByAddress.get(strategy.tokenBMint.toString());
    if (!tokenPriceA || !tokenPriceB) continue;

    const lpTokenMint = strategy.sharesMint;
    const lpSupplyAndDecimals = await fetchTokenSupplyAndDecimals(
      lpTokenMint,
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
    // const { amountA, amountB } = getStrategyBalances(strategy, pool, position);
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
      address: lpTokenMint.toString(),
      decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Kamino Vault',
      underlyings,
    });
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
