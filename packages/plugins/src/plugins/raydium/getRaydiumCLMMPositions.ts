import {
  NetworkId,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { FindNftsByOwnerOutput } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { platformId, raydiumProgram } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { personalPositionStateStruct, poolStateStruct } from './structs/clmms';
import { Cache } from '../../Cache';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';

export async function getRaydiumCLMMPositions(
  cache: Cache,
  nfts: FindNftsByOwnerOutput
): Promise<PortfolioElement[]> {
  const client = getClientSolana();

  const positionsProgramAddress: PublicKey[] = [];
  nfts.forEach((nft) => {
    const address =
      nft.model === 'metadata'
        ? new PublicKey(nft.mintAddress.toString())
        : new PublicKey(nft.mint.address.toString());

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

  const poolsStateInfo = await getParsedMultipleAccountsInfo(
    client,
    poolStateStruct,
    personalPositionsInfo.flatMap((position) =>
      position ? position.poolId : []
    )
  );
  if (!poolsStateInfo) return [];

  if (poolsStateInfo.length !== personalPositionsInfo.length) return [];

  const assets: PortfolioLiquidity[] = [];
  let totalLiquidityValue = 0;
  for (let index = 0; index < personalPositionsInfo.length; index++) {
    const poolStateInfo = poolsStateInfo[index];
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

  const elements: PortfolioElementLiquidity[] = [];
  elements.push({
    type: PortfolioElementType.liquidity,
    networkId: NetworkId.solana,
    platformId,
    label: 'LiquidityPool',
    tags: ['Concentrated'],
    value: totalLiquidityValue,
    data: {
      liquidities: assets,
    },
  });

  return elements;
}
