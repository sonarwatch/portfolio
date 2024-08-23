import BigNumber from 'bignumber.js';
import {
  formatMoveTokenAddress,
  NetworkId,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { getObject } from '../../utils/sui/getObject';
import { Pool } from '../cetus/types';
import {
  alphaPoolsInfoKey,
  alphaToken,
  alphaVaultAddress,
  investorByCetusPool,
  investorsPositionType,
  naviPools,
  platformId,
} from './constants';
import {
  AlphaPool,
  AlphaPoolInfo,
  AlphaVault,
  CetusPosition,
  Investor,
} from './types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { getPoolFromObject } from '../cetus/helpers';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const poolsInfos: AlphaPoolInfo[] = [];
  const aplhaPools = Array.from(investorByCetusPool.keys());

  for (let n = 0; n < aplhaPools.length; n++) {
    const alphaPoolAddress = aplhaPools[n];

    const investor = investorByCetusPool.get(alphaPoolAddress);
    if (!investor) continue;

    const investorObj = await getObject<Investor>(client, investor);
    if (!investorObj || !investorObj.data?.content?.fields) continue;

    const dynFieldObjs = await getDynamicFieldObjects<CetusPosition>(
      client,
      investor
    );

    const lpPositionObj = dynFieldObjs.find(
      (obj) => obj.data?.content?.type === investorsPositionType
    );
    if (!lpPositionObj) continue;

    const lpPosition = lpPositionObj.data?.content?.fields.value.fields;
    if (!lpPosition) continue;

    const poolObj = await getObject<Pool>(client, lpPosition.pool);
    if (!poolObj.data?.content?.fields) continue;

    const pool = getPoolFromObject(poolObj);

    const upperBound = 443636;
    let tickLowerIndex = Number(investorObj.data.content.fields.lower_tick);
    let tickUpperIndex = Number(investorObj.data.content.fields.upper_tick);

    if (tickLowerIndex > upperBound) {
      // eslint-disable-next-line no-bitwise
      tickLowerIndex = -~(tickLowerIndex - 1);
    }
    if (tickUpperIndex > upperBound) {
      // eslint-disable-next-line no-bitwise
      tickUpperIndex = -~(tickUpperIndex - 1);
    }

    const alphaPool = await getObject<AlphaPool>(client, alphaPoolAddress);
    if (!alphaPool.data?.content?.fields) continue;

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(lpPosition.liquidity),
      pool.current_tick_index,
      tickLowerIndex,
      tickUpperIndex,
      false
    );

    poolsInfos.push({
      cointTypeA: formatMoveTokenAddress(pool.coinTypeA),
      cointTypeB: formatMoveTokenAddress(pool.coinTypeB),
      tokenAmountA,
      tokenAmountB,
      alphaPoolId: alphaPoolAddress,
      underlyingPoolId: pool.poolAddress,
      xTokenSupply: BigNumber(alphaPool.data.content.fields.xTokenSupply),
      tokensInvested: BigNumber(alphaPool.data.content.fields.tokensInvested),
    });
  }

  const alphaVaultObj = await getObject<AlphaVault>(client, alphaVaultAddress);
  if (alphaVaultObj && alphaVaultObj.data?.content?.fields) {
    const alphaVault = alphaVaultObj.data?.content?.fields;
    poolsInfos.push({
      alphaPoolId: alphaVaultAddress,
      cointTypeA: alphaToken,
      tokenAmountA: BigNumber(alphaVault.alpha_bal),
      tokensInvested: BigNumber(alphaVault.tokensInvested),
      xTokenSupply: BigNumber(alphaVault.xTokenSupply),
      unlockAt: new BigNumber(alphaVault.locking_start_ms)
        .plus(alphaVault.locked_period_in_ms)
        .toNumber(),
    });
  }

  const naviPoolsObjs = await multiGetObjects<AlphaPool>(client, naviPools);
  naviPoolsObjs.forEach((obj, index) => {
    if (!obj.data?.content?.fields) return;

    const naviPool = obj.data.content.fields;

    const types = parseTypeString(obj.data.type);
    if (!types.keys) return;

    const token = types.keys[0].type;

    poolsInfos.push({
      alphaPoolId: naviPools[index],
      cointTypeA: token,
      tokenAmountA: BigNumber(naviPool.tokensInvested),
      xTokenSupply: BigNumber(naviPool.xTokenSupply),
      tokensInvested: BigNumber(naviPool.tokensInvested),
    });
  });

  await cache.setItem(alphaPoolsInfoKey, poolsInfos, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};

export default job;
