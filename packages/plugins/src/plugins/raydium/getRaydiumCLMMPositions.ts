import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, raydiumProgram } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import {
  personalPositionStateStruct,
  tickArrayStatetruct,
  poolStateStruct,
} from './structs/clmms';
import { Cache } from '../../Cache';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { getFeesAndRewardsBalance, getTickArrayAddress } from './helpers';

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

  const poolsIds: PublicKey[] = personalPositionsInfo.flatMap((position) =>
    position ? position.poolId : []
  );

  const poolStatesInfo = await getParsedMultipleAccountsInfo(
    client,
    poolStateStruct,
    poolsIds
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

  const elements: PortfolioElementLiquidity[] = [];

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

    const tags = [];
    if (tokenAmountA.isZero() || tokenAmountB.isZero())
      tags.push('Out Of Range');

    const rewardAssets: PortfolioAsset[] = [];

    const feesAndRewardsBalances = getFeesAndRewardsBalance(
      personalPositionInfo,
      poolStateInfo,
      tickArrays[index]
    );

    if (feesAndRewardsBalances) {
      if (feesAndRewardsBalances.tokenFeeAmountA.isGreaterThan(0))
        rewardAssets.push(
          tokenPriceToAssetToken(
            tokenPriceA.address,
            feesAndRewardsBalances.tokenFeeAmountA
              .dividedBy(10 ** tokenPriceA.decimals)
              .toNumber(),
            NetworkId.solana,
            tokenPriceA
          )
        );

      if (feesAndRewardsBalances.tokenFeeAmountB.isGreaterThan(0))
        rewardAssets.push(
          tokenPriceToAssetToken(
            tokenPriceB.address,
            feesAndRewardsBalances.tokenFeeAmountB
              .dividedBy(10 ** tokenPriceB.decimals)
              .toNumber(),
            NetworkId.solana,
            tokenPriceB
          )
        );

      feesAndRewardsBalances.rewards.forEach((rewardBalance, i) => {
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
    }

    const assets = [assetTokenA, assetTokenB];
    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((a) => a.value));
    const value = getUsdValueSum(
      [...assets, ...rewardAssets].map((a) => a.value)
    );

    if (!value) continue;

    const liquidities = [
      {
        assets,
        assetsValue,
        rewardAssets,
        rewardAssetsValue,
        value,
        yields: [],
      },
    ];

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
      tags,
    });
  }

  return elements;
}
