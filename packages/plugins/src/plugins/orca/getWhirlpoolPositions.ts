import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import {
  platformId as orcaPlatformId,
  whirlpoolPrefix,
  whirlpoolProgram,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
} from '../../utils/solana';
import { Cache } from '../../Cache';
import { Whirlpool, positionStruct } from './structs/whirlpool';
import { NftFetcher } from '../tokens/types';
import { calcFeesAndRewards, getTickArraysAsMap } from './helpers_fees';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { WhirlpoolStat } from './types';

export const getWhirlpoolPositions = getOrcaNftFetcher(
  orcaPlatformId,
  whirlpoolProgram
);

export function getOrcaNftFetcher(
  platformId: string,
  programId: PublicKey
): NftFetcher {
  return async (
    cache: Cache,
    nfts: PortfolioAssetCollectible[]
  ): Promise<PortfolioElement[]> => {
    const client = getClientSolana();
    const positionsProgramAddress: PublicKey[] = [];

    nfts.forEach((nft) => {
      const address = new PublicKey(nft.data.address);

      const positionSeed = [Buffer.from('position'), address.toBuffer()];

      const [programAddress] = PublicKey.findProgramAddressSync(
        positionSeed,
        programId
      );
      positionsProgramAddress.push(programAddress);
    });
    if (positionsProgramAddress.length === 0) return [];

    const positionsInfo = await getParsedMultipleAccountsInfo(
      client,
      positionStruct,
      positionsProgramAddress
    );
    if (!positionsInfo || positionsInfo.length === 0) return [];

    const whirlpoolAddresses: Set<string> = new Set();
    positionsInfo.forEach((pos) => {
      if (pos) whirlpoolAddresses.add(pos.whirlpool.toString());
    });

    const [allWhirlpoolsInfo, allWhirlpoolsStats] = await Promise.all([
      cache.getItems<ParsedAccount<Whirlpool>>(Array.from(whirlpoolAddresses), {
        prefix: whirlpoolPrefix,
        networkId: NetworkId.solana,
      }),
      cache.getItems<WhirlpoolStat>(
        Array.from(whirlpoolAddresses).map((a) => `${a}-stats`),
        {
          prefix: whirlpoolPrefix,
          networkId: NetworkId.solana,
        }
      ),
    ]);
    if (!allWhirlpoolsInfo)
      throw new Error('Whirlpool info not found in cache.');

    const whirlpoolMap: Map<string, ParsedAccount<Whirlpool>> = new Map();
    allWhirlpoolsInfo.forEach((wInfo) => {
      if (!wInfo) return;
      if (whirlpoolAddresses.has(wInfo.pubkey.toString())) {
        whirlpoolMap.set(wInfo.pubkey.toString(), wInfo);
      }
    });

    if (whirlpoolMap.size === 0) return [];

    const tickArrays = await getTickArraysAsMap(positionsInfo, whirlpoolMap);

    const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
    for (let index = 0; index < positionsInfo.length; index++) {
      const positionInfo = positionsInfo[index];
      if (!positionInfo) continue;

      const whirlpoolInfo = whirlpoolMap.get(positionInfo.whirlpool.toString());
      if (!whirlpoolInfo) continue;

      if (
        !whirlpoolInfo.tokenMintA ||
        !whirlpoolInfo.tokenMintB ||
        !whirlpoolInfo.tickCurrentIndex
      )
        continue;

      const element = elementRegistry.addElementConcentratedLiquidity({
        link: 'https://www.orca.so/portfolio',
        ref: positionInfo.pubkey.toString(),
        sourceRefs: [
          {
            name: 'Pool',
            address: whirlpoolInfo.pubkey.toString(),
          },
        ],
      });
      const liquidity = element.setLiquidity({
        addressA: whirlpoolInfo.tokenMintA,
        addressB: whirlpoolInfo.tokenMintB,
        liquidity: positionInfo.liquidity,
        tickCurrentIndex: whirlpoolInfo.tickCurrentIndex,
        tickLowerIndex: positionInfo.tickLowerIndex,
        tickUpperIndex: positionInfo.tickUpperIndex,
        currentSqrtPrice: whirlpoolInfo.sqrtPrice,
        poolLiquidity: whirlpoolInfo.liquidity,
        feeRate:
          (Number(whirlpoolInfo.feeRate) / 10000) *
          (1 - whirlpoolInfo.protocolFeeRate / 10000),
        swapVolume24h: allWhirlpoolsStats.find(
          (p) => p?.address === positionInfo.whirlpool.toString()
        )?.stats['24h'].volume,
      });

      const feesAndRewards = calcFeesAndRewards(
        whirlpoolInfo,
        positionInfo,
        tickArrays
      );

      if (feesAndRewards) {
        liquidity.addRewardAsset({
          address: whirlpoolInfo.tokenMintA,
          amount: feesAndRewards.feeOwedA,
        });

        liquidity.addRewardAsset({
          address: whirlpoolInfo.tokenMintB,
          amount: feesAndRewards.feeOwedB,
        });

        liquidity.addRewardAsset({
          address: whirlpoolInfo.rewardInfos[0].mint,
          amount: feesAndRewards.rewardOwedA,
        });

        liquidity.addRewardAsset({
          address: whirlpoolInfo.rewardInfos[1].mint,
          amount: feesAndRewards.rewardOwedB,
        });

        liquidity.addRewardAsset({
          address: whirlpoolInfo.rewardInfos[2].mint,
          amount: feesAndRewards.rewardOwedC,
        });
      }
    }

    return elementRegistry.getElements(cache);
  };
}
