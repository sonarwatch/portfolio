/* eslint-disable no-case-declarations */
import BigNumber from 'bignumber.js';
import { formatMoveTokenAddress, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { getObject } from '../../utils/sui/getObject';
import { alphaPoolsInfoKey, platformId } from './constants';
import {
  platformId as bluefinPlatformId,
  clmmsPoolsKey,
} from '../bluefin/constants';
import {
  AlphaPool,
  AlphaPoolInfo,
  AlphaVault,
  CetusPosition,
  Investor,
} from './types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { poolsInfos } from './poolsInfos';
import { ObjectResponse } from '../../utils/sui/types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getPools } from '../cetus/getPools';
import { ClmmPool } from '../bluefin/types';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const cachedPoolsInfos: AlphaPoolInfo[] = [];

  const [poolObjects, bluefinPools] = await Promise.all([
    multiGetObjects(
      client,
      Object.values(poolsInfos).map((poolInfo) => poolInfo.poolId)
    ),
    cache.getItem<ObjectResponse<ClmmPool>[]>(clmmsPoolsKey, {
      prefix: bluefinPlatformId,
      networkId: NetworkId.sui,
    }),
  ]);

  for (const [i, poolInfo] of Object.values(poolsInfos).entries()) {
    const poolObject = poolObjects[i];
    if (!poolObject.data) continue;

    switch (poolInfo.parentProtocolName) {
      case 'ALPHAFI':
        const alphaVaultObj = poolObject as ObjectResponse<AlphaVault>;
        if (alphaVaultObj && alphaVaultObj.data?.content?.fields) {
          cachedPoolsInfos.push({
            alphaPoolId: poolObject.data.objectId,
            coinTypeA: poolInfo.assetTypes[0],
            tokenAmountA: BigNumber(
              alphaVaultObj.data.content.fields.alpha_bal
            ),
            tokensInvested: BigNumber(
              alphaVaultObj.data.content.fields.tokensInvested
            ),
            xTokenSupply: BigNumber(
              alphaVaultObj.data.content.fields.xTokenSupply
            ),
            unlockAt: new BigNumber(
              alphaVaultObj.data.content.fields.locking_start_ms
            )
              .plus(alphaVaultObj.data.content.fields.locked_period_in_ms)
              .toNumber(),
            protocol: poolInfo.parentProtocolName,
          });
        }
        break;
      case 'BLUEFIN':
        if (!bluefinPools) continue;

        const investorBfObj = await getObject<Investor>(
          client,
          poolInfo.investorId
        );
        if (!investorBfObj || !investorBfObj.data?.content?.fields) continue;

        const dynFieldBfObjs = await getDynamicFieldObjects(
          client,
          poolInfo.investorId
        );

        const lpPositionBfObj = dynFieldBfObjs.find(
          (obj2) =>
            obj2.data?.content?.type ===
            '0x2::dynamic_field::Field<vector<u8>, 0x3492c874c1e3b3e2984e8c41b589e642d4d0a5d6459e5a9cfc2d52fd7c89c267::position::Position>'
        );
        const lpPositionBf = lpPositionBfObj?.data?.content?.fields;
        if (!lpPositionBf) continue;
        const bluefinPool = bluefinPools.find(
          // @ts-ignore
          (p) => p.data?.objectId === lpPositionBf.value.fields.pool_id
        );
        if (!bluefinPool?.data?.content?.fields) continue;

        const alphaPoolBf = poolObject as ObjectResponse<AlphaPool>;
        if (!alphaPoolBf.data?.content?.fields) continue;

        const { tokenAmountA: tokenAmountBfA, tokenAmountB: tokenAmountBfB } =
          getTokenAmountsFromLiquidity(
            // @ts-ignore
            new BigNumber(lpPositionBf.value.fields.liquidity),
            bitsToNumber(
              bluefinPool.data.content.fields.current_tick_index.fields.bits
            ),
            // @ts-ignore
            bitsToNumber(lpPositionBf.value.fields.lower_tick.fields.bits),
            // @ts-ignore
            bitsToNumber(lpPositionBf.value.fields.upper_tick.fields.bits),
            false
          );

        cachedPoolsInfos.push({
          coinTypeA: formatMoveTokenAddress(poolInfo.assetTypes[0]),
          coinTypeB: formatMoveTokenAddress(poolInfo.assetTypes[1]),
          tokenAmountA: tokenAmountBfA,
          tokenAmountB: tokenAmountBfB,
          alphaPoolId: poolObject.data.objectId,
          underlyingPoolId: bluefinPool.data.content.fields.id.id,
          xTokenSupply: BigNumber(alphaPoolBf.data.content.fields.xTokenSupply),
          tokensInvested: BigNumber(
            alphaPoolBf.data.content.fields.tokensInvested
          ),
          protocol: poolInfo.parentProtocolName,
        });
        break;
      case 'CETUS':
        const investorCetusObj = await getObject<Investor>(
          client,
          poolInfo.investorId
        );
        if (!investorCetusObj || !investorCetusObj.data?.content?.fields)
          continue;

        const dynFieldObjs = await getDynamicFieldObjects<CetusPosition>(
          client,
          poolInfo.investorId
        );

        const lpPositionObj = dynFieldObjs.find(
          (obj2) =>
            obj2.data?.content?.type ===
            '0x2::dynamic_field::Field<vector<u8>, 0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position>'
        );
        if (!lpPositionObj) continue;

        const lpPosition = lpPositionObj.data?.content?.fields.value.fields;
        if (!lpPosition) continue;

        const cetusPool = (await getPools([lpPosition.pool], cache))[0];
        if (!cetusPool) continue;

        const upperBound = 443636;
        let tickLowerIndex = Number(
          investorCetusObj.data.content.fields.lower_tick
        );
        let tickUpperIndex = Number(
          investorCetusObj.data.content.fields.upper_tick
        );

        if (tickLowerIndex > upperBound) {
          // eslint-disable-next-line no-bitwise
          tickLowerIndex = -~(tickLowerIndex - 1);
        }
        if (tickUpperIndex > upperBound) {
          // eslint-disable-next-line no-bitwise
          tickUpperIndex = -~(tickUpperIndex - 1);
        }

        const alphaPool = poolObject as ObjectResponse<AlphaPool>;
        if (!alphaPool.data?.content?.fields) continue;

        const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
          new BigNumber(lpPosition.liquidity),
          cetusPool.current_tick_index,
          tickLowerIndex,
          tickUpperIndex,
          false
        );

        cachedPoolsInfos.push({
          coinTypeA: formatMoveTokenAddress(cetusPool.coinTypeA),
          coinTypeB: formatMoveTokenAddress(cetusPool.coinTypeB),
          tokenAmountA,
          tokenAmountB,
          alphaPoolId: poolObject.data.objectId,
          underlyingPoolId: cetusPool.poolAddress,
          xTokenSupply: BigNumber(alphaPool.data.content.fields.xTokenSupply),
          tokensInvested: BigNumber(
            alphaPool.data.content.fields.tokensInvested
          ),
          protocol: poolInfo.parentProtocolName,
        });
        break;
      case 'NAVI':
      case 'BUCKET':
        const vaultObj = poolObject as ObjectResponse<AlphaPool>;
        if (vaultObj && vaultObj.data?.content?.fields)
          cachedPoolsInfos.push({
            alphaPoolId: poolObject.data.objectId,
            coinTypeA: poolInfo.assetTypes[0],
            tokenAmountA: BigNumber(
              vaultObj.data.content.fields.tokensInvested
            ),
            xTokenSupply: BigNumber(vaultObj.data.content.fields.xTokenSupply),
            tokensInvested: BigNumber(
              vaultObj.data.content.fields.tokensInvested
            ),
            protocol: poolInfo.parentProtocolName,
          });
        break;
      default:
        console.log(`Unsupported pool type ${poolInfo.parentProtocolName}`);
        break;
    }
  }

  await cache.setItem(alphaPoolsInfoKey, cachedPoolsInfos, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};

export default job;
