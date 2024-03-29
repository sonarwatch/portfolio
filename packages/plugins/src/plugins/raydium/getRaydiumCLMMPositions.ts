import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, poolStatesPrefix, raydiumProgram } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { PoolState, personalPositionStateStruct } from './structs/clmms';
import { Cache } from '../../Cache';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';

export async function getRaydiumCLMMPositions(
  cache: Cache,
  nfts: PortfolioAssetCollectible[]
): Promise<PortfolioElement[]> {
  const client = getClientSolana();

  const positionsProgramAddress: PublicKey[] = [];
  nfts.forEach((nft) => {
    const address = new PublicKey(nft.data.address);

    const positionSeed = [Buffer.from('position'), address.toBuffer()];

    const [programAddress] = PublicKey.findProgramAddressSync(
      positionSeed,
      raydiumProgram
    );
    positionsProgramAddress.push(programAddress);
  });
  if (positionsProgramAddress.length === 0) return [];

  const personalPositionsInfo = await getParsedMultipleAccountsInfo(
    client,
    personalPositionStateStruct,
    positionsProgramAddress
  );
  if (!personalPositionsInfo || personalPositionsInfo.length === 0) return [];

  const poolsIds: string[] = personalPositionsInfo.flatMap((position) =>
    position ? position.poolId.toString() : []
  );

  const poolStatesInfo = await cache.getItems<PoolState>(poolsIds, {
    prefix: poolStatesPrefix,
    networkId: NetworkId.solana,
  });

  const assets: PortfolioLiquidity[] = [];
  let totalLiquidityValue = 0;
  for (let index = 0; index < personalPositionsInfo.length; index++) {
    const poolStateInfo = poolStatesInfo[index];

    if (!poolStateInfo) continue;

    const personalPositionInfo = personalPositionsInfo[index];
    if (!personalPositionInfo) continue;

    if (
      !poolStateInfo.tokenMint0 ||
      !poolStateInfo.tokenMint1 ||
      !poolStateInfo.tickCurrent
    )
      continue;
    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      personalPositionInfo.liquidity,
      poolStateInfo.tickCurrent,
      personalPositionInfo.tickLowerIndex,
      personalPositionInfo.tickUpperIndex,
      false
    );
    if (!tokenAmountA || !tokenAmountB) continue;
    const tokenPriceA = await cache.getTokenPrice(
      poolStateInfo.tokenMint0.toString(),
      NetworkId.solana
    );
    if (!tokenPriceA) continue;
    const assetTokenA = tokenPriceToAssetToken(
      poolStateInfo.tokenMint0.toString(),
      tokenAmountA.dividedBy(10 ** tokenPriceA.decimals).toNumber(),
      NetworkId.solana,
      tokenPriceA
    );
    const tokenPriceB = await cache.getTokenPrice(
      poolStateInfo.tokenMint1.toString(),
      NetworkId.solana
    );
    if (!tokenPriceB) continue;
    const assetTokenB = tokenPriceToAssetToken(
      poolStateInfo.tokenMint1.toString(),
      tokenAmountB.dividedBy(10 ** tokenPriceB.decimals).toNumber(),
      NetworkId.solana,
      tokenPriceB
    );
    if (
      !assetTokenB ||
      !assetTokenA ||
      assetTokenB.value === null ||
      assetTokenA.value === null
    )
      continue;
    const value = assetTokenB.value + assetTokenA.value;
    assets.push({
      assets: [assetTokenA, assetTokenB],
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: 0,
      value,
      yields: [],
    });
    totalLiquidityValue += value;
  }

  if (assets.length === 0) return [];

  const elements: PortfolioElementLiquidity[] = [];
  elements.push({
    type: PortfolioElementType.liquidity,
    networkId: NetworkId.solana,
    platformId,
    label: 'LiquidityPool',
    name: 'Concentrated',
    value: totalLiquidityValue,
    data: {
      liquidities: assets,
    },
  });

  return elements;
}
