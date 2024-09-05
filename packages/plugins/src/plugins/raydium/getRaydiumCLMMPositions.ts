import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, poolStatesPrefix, raydiumProgram } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import {
  PoolState,
  personalPositionStateStruct,
  tickArrayStatetruct,
} from './structs/clmms';
import { Cache } from '../../Cache';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { getRewardBalance, getTickArrayAddress } from './helpers';

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

  const poolStatesInfo = await cache.getItems<ParsedAccount<PoolState>>(
    poolsIds,
    {
      prefix: poolStatesPrefix,
      networkId: NetworkId.solana,
    }
  );

  const mints: Set<string> = new Set();

  personalPositionsInfo.forEach((personalPositionInfo, index) => {
    if (!personalPositionInfo) return;
    const poolStateInfo = poolStatesInfo[index];
    if (!poolStateInfo) return;
    mints.add(poolStateInfo.tokenMint0.toString());
    mints.add(poolStateInfo.tokenMint1.toString());
    poolStateInfo.rewardInfos.forEach((ri) => {
      if (ri.tokenMint.toString() !== '11111111111111111111111111111111') {
        mints.add(ri.tokenMint.toString());
      }
    });
  });

  const [tickArrays, tokenPrices] = await Promise.all([
    Promise.all(
      personalPositionsInfo.map((personalPositionInfo, index) => {
        if (!personalPositionInfo) return [];
        const poolStateInfo = poolStatesInfo[index];
        if (!poolStateInfo) return [];

        return getParsedMultipleAccountsInfo(client, tickArrayStatetruct, [
          getTickArrayAddress(
            raydiumProgram.toString(),
            poolStateInfo.pubkey.toString(),
            personalPositionInfo.tickLowerIndex,
            poolStateInfo.tickSpacing
          ),
          getTickArrayAddress(
            raydiumProgram.toString(),
            poolStateInfo.pubkey.toString(),
            personalPositionInfo.tickUpperIndex,
            poolStateInfo.tickSpacing
          ),
        ]);
      })
    ),
    cache.getTokenPricesAsMap([...Array.from(mints)], NetworkId.solana),
  ]);

  const liquidities: PortfolioLiquidity[] = [];
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

    const tokenPriceA = tokenPrices.get(poolStateInfo.tokenMint0.toString());
    const tokenPriceB = tokenPrices.get(poolStateInfo.tokenMint1.toString());
    if (!tokenPriceA || !tokenPriceB) continue;

    const assetTokenA = tokenPriceToAssetToken(
      tokenPriceA.address,
      tokenAmountA.dividedBy(10 ** tokenPriceA.decimals).toNumber(),
      NetworkId.solana,
      tokenPriceA
    );

    const assetTokenB = tokenPriceToAssetToken(
      tokenPriceB.address,
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

    if (tokenAmountA.isZero()) assetTokenA.attributes.tags = ['Out Of Range'];
    if (tokenAmountB.isZero()) assetTokenB.attributes.tags = ['Out Of Range'];

    const rewardAssets: PortfolioAsset[] = [];

    const rewardBalances = getRewardBalance(
      personalPositionInfo,
      poolStateInfo,
      tickArrays[index]
    );

    rewardBalances.forEach((rewardBalance, i) => {
      if (
        rewardBalance.isZero() ||
        poolStateInfo.rewardInfos[i].tokenMint.toString() ===
          '11111111111111111111111111111111'
      )
        return;

      const rewardTokenPrice = tokenPrices.get(
        poolStateInfo.rewardInfos[i].tokenMint.toString()
      );
      if (!rewardTokenPrice) return;
      rewardAssets.push(
        tokenPriceToAssetToken(
          poolStateInfo.rewardInfos[i].tokenMint.toString(),
          rewardBalance.dividedBy(10 ** rewardTokenPrice.decimals).toNumber(),
          NetworkId.solana,
          rewardTokenPrice
        )
      );
    });

    const assets = [assetTokenA, assetTokenB];
    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((a) => a.value));
    const value = getUsdValueSum(
      [...assets, ...rewardAssets].map((a) => a.value)
    );

    if (!value) continue;

    liquidities.push({
      assets,
      assetsValue,
      rewardAssets,
      rewardAssetsValue,
      value,
      yields: [],
    });
  }

  if (liquidities.length === 0) return [];

  const elements: PortfolioElementLiquidity[] = [];
  elements.push({
    type: PortfolioElementType.liquidity,
    networkId: NetworkId.solana,
    platformId,
    label: 'LiquidityPool',
    name: 'Concentrated',
    value: getUsdValueSum(liquidities.map((a) => a.value)),
    data: {
      liquidities,
    },
  });

  return elements;
}
