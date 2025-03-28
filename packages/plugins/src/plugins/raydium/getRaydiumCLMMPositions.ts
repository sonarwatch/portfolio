import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, poolStatsPrefix, raydiumProgram } from './constants';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import {
  personalPositionStateStruct,
  tickArrayStatetruct,
  poolStateStruct,
} from './structs/clmms';
import { Cache } from '../../Cache';
import { getFeesAndRewardsBalance, getTickArrayAddress } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { WhirlpoolStat } from '../orca/types';

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

  const [poolStatesInfo, poolsStats] = await Promise.all([
    getParsedMultipleAccountsInfo(client, poolStateStruct, poolsIds),
    cache.getItems<WhirlpoolStat>(
      poolsIds.map((p) => p.toString()),
      { prefix: poolStatsPrefix, networkId: NetworkId.solana }
    ),
  ]);

  const tickArrays = await Promise.all(
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
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (let index = 0; index < personalPositionsInfo.length; index++) {
    const poolStateInfo = poolStatesInfo[index];

    if (!poolStateInfo) continue;

    const personalPositionInfo = personalPositionsInfo[index];
    if (!personalPositionInfo) continue;

    const element = elementRegistry.addElementConcentratedLiquidity({
      link: 'https://raydium.io/portfolio/?position_tab=concentrated',
    });

    const poolStats = poolsStats.find(
      (p) => p?.address === personalPositionInfo.poolId.toString()
    );

    const liquidity = element.setLiquidity({
      addressA: poolStateInfo.tokenMint0,
      addressB: poolStateInfo.tokenMint1,
      liquidity: personalPositionInfo.liquidity,
      tickCurrentIndex: poolStateInfo.tickCurrent,
      tickLowerIndex: personalPositionInfo.tickLowerIndex,
      tickUpperIndex: personalPositionInfo.tickUpperIndex,
      ref: personalPositionInfo.pubkey,
      swapVolume24h: poolStats?.stats['24h'].volume,
      feeRate: poolStats?.feeRate,
      currentSqrtPrice: poolStateInfo.sqrtPriceX64,
      poolLiquidity: poolStateInfo.liquidity,
      sourceRefs: [
        {
          name: 'Pool',
          address: personalPositionInfo.poolId.toString(),
        },
        {
          name: 'NFT Mint',
          address: personalPositionInfo.nftMint.toString(),
        },
      ],
    });

    const feesAndRewardsBalances = getFeesAndRewardsBalance(
      personalPositionInfo,
      poolStateInfo,
      tickArrays[index]
    );

    if (feesAndRewardsBalances) {
      liquidity.addRewardAsset({
        address: poolStateInfo.tokenMint0,
        amount: feesAndRewardsBalances.tokenFeeAmountA,
      });

      liquidity.addRewardAsset({
        address: poolStateInfo.tokenMint1,
        amount: feesAndRewardsBalances.tokenFeeAmountB,
      });

      feesAndRewardsBalances.rewards.forEach((rewardBalance, i) => {
        if (
          rewardBalance.isZero() ||
          poolStateInfo.rewardInfos[i].tokenMint.toString() ===
            '11111111111111111111111111111111'
        )
          return;

        liquidity.addRewardAsset({
          address: poolStateInfo.rewardInfos[i].tokenMint,
          amount: rewardBalance,
        });
      });
    }
  }

  return elementRegistry.getElements(cache);
}
