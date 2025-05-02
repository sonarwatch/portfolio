import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { dlmmProgramId, platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
} from '../../../utils/solana';
import {
  BinArray,
  binArrayStruct,
  dlmmPositionV1Struct,
  dlmmPositionV2Struct,
  LbPair,
  lbPairStruct,
} from './structs';
import {
  binIdToBinArrayIndex,
  deriveBinArray,
  processPosition,
} from './dlmmHelper';
import { PositionVersion } from '../types';
import { getMultipleAccountsInfoSafe } from '../../../utils/solana/getMultipleAccountsInfoSafe';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { ParsedGpa } from '../../../utils/solana/beets/ParsedGpa';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userPubKey = new PublicKey(owner);

  const [positionsV1, positionsV2] = await Promise.all([
    ParsedGpa.build(client, dlmmPositionV1Struct, dlmmProgramId)
      .addFilter('owner', userPubKey)
      .addDataSizeFilter(7560)
      .run(),
    ParsedGpa.build(client, dlmmPositionV2Struct, dlmmProgramId)
      .addFilter('owner', userPubKey)
      .addDataSizeFilter(8120)
      .run(),
  ]);
  const positions = [...positionsV1, ...positionsV2];
  if (positions.length === 0) return [];

  const binArrayPubkeySet = new Set<string>();
  const lbPairSet = new Set<string>();
  positions.forEach(({ upperBinId, lowerBinId, lbPair }) => {
    const lowerBinArrayIndex = binIdToBinArrayIndex(new BigNumber(lowerBinId));
    const upperBinArrayIndex = binIdToBinArrayIndex(new BigNumber(upperBinId));

    const [lowerBinArrayPubKey] = deriveBinArray(
      lbPair,
      lowerBinArrayIndex,
      dlmmProgramId
    );
    const [upperBinArrayPubKey] = deriveBinArray(
      lbPair,
      upperBinArrayIndex,
      dlmmProgramId
    );
    binArrayPubkeySet.add(lowerBinArrayPubKey.toBase58());
    binArrayPubkeySet.add(upperBinArrayPubKey.toBase58());
    lbPairSet.add(lbPair.toBase58());
  });
  const binArrayKeys = Array.from(binArrayPubkeySet).map(
    (pubkey) => new PublicKey(pubkey)
  );
  const lbPairKeys = Array.from(lbPairSet).map(
    (pubkey) => new PublicKey(pubkey)
  );

  const accounts = await getMultipleAccountsInfoSafe(client, [
    ...binArrayKeys,
    ...lbPairKeys,
  ]);

  const binArraysById: Map<string, BinArray> = new Map();
  const lbPairById: Map<string, LbPair> = new Map();
  const mints: Set<string> = new Set();
  for (let i = 0; i < accounts.length; i++) {
    const rawAccount = accounts[i];
    if (!rawAccount) continue;

    if (i < binArrayKeys.length) {
      const binArrayAcc = binArrayStruct.deserialize(rawAccount.data)[0];
      binArraysById.set(binArrayKeys[i].toBase58(), binArrayAcc);
    } else {
      const lbPairAcc = lbPairStruct.deserialize(rawAccount.data)[0];
      mints.add(lbPairAcc.tokenXMint.toString());
      mints.add(lbPairAcc.tokenYMint.toString());
      if (lbPairAcc.rewardInfos[0].mint)
        mints.add(lbPairAcc.rewardInfos[0].mint.toString());
      if (lbPairAcc.rewardInfos[1].mint)
        mints.add(lbPairAcc.rewardInfos[1].mint.toString());
      lbPairById.set(lbPairKeys[i - binArrayKeys.length].toBase58(), lbPairAcc);
    }
  }
  const reservePublicKeys = Array.from(lbPairById.values())
    .map(({ reserveX, reserveY }) => [reserveX, reserveY])
    .flat();

  const [tokenPriceById, reserveAccountsInfo] = await Promise.all([
    cache.getTokenPricesAsMap(Array.from(mints), NetworkId.solana),
    getParsedMultipleAccountsInfo(
      client,
      tokenAccountStruct,
      reservePublicKeys
    ),
  ]);

  const lbPairReserveMap = new Map<
    string,
    { reserveX: BigNumber; reserveY: BigNumber }
  >();
  lbPairKeys.forEach((lbPair, idx) => {
    const index = idx * 2;
    const reserveAccX = reserveAccountsInfo[index];
    const reserveAccY = reserveAccountsInfo[index + 1];
    if (reserveAccX && reserveAccY)
      lbPairReserveMap.set(lbPair.toBase58(), {
        reserveX: reserveAccX.amount,
        reserveY: reserveAccY.amount,
      });
  });

  const elements: PortfolioElement[] = [];

  for (let idx = 0; idx < positions.length; idx++) {
    const account = positions[idx];

    const { upperBinId, lowerBinId, lbPair } = account;
    const lowerBinArrayIndex = binIdToBinArrayIndex(new BigNumber(lowerBinId));
    const upperBinArrayIndex = binIdToBinArrayIndex(new BigNumber(upperBinId));

    const [lowerBinArrayPubKey] = deriveBinArray(
      lbPair,
      lowerBinArrayIndex,
      dlmmProgramId
    );
    const [upperBinArrayPubKey] = deriveBinArray(
      lbPair,
      upperBinArrayIndex,
      dlmmProgramId
    );

    const lowerBinArray = binArraysById.get(lowerBinArrayPubKey.toBase58());
    const upperBinArray = binArraysById.get(upperBinArrayPubKey.toBase58());
    const lbPairAcc = lbPairById.get(lbPair.toBase58());
    if (!lbPairAcc || !lowerBinArray || !upperBinArray) continue;

    const tokenPriceX = tokenPriceById.get(lbPairAcc.tokenXMint.toString());
    const tokenPriceY = tokenPriceById.get(lbPairAcc.tokenYMint.toString());
    const tokenPriceRewardX = lbPairAcc.rewardInfos[0].mint
      ? tokenPriceById.get(lbPairAcc.rewardInfos[0].mint.toString())
      : undefined;
    const tokenPriceRewardY = lbPairAcc.rewardInfos[1].mint
      ? tokenPriceById.get(lbPairAcc.rewardInfos[1].mint.toString())
      : undefined;
    if (!tokenPriceX || !tokenPriceY) continue;

    const baseTokenDecimal = tokenPriceX.decimals;
    const quoteTokenDecimal = tokenPriceY.decimals;

    const positionVersion =
      idx < positionsV1.length ? PositionVersion.V1 : PositionVersion.V2;

    const positionData = processPosition(
      dlmmProgramId,
      positionVersion,
      lbPairAcc,
      account,
      baseTokenDecimal,
      quoteTokenDecimal,
      lowerBinArray,
      upperBinArray
    );

    const assets: PortfolioAsset[] = [];
    const rewardAssets: PortfolioAsset[] = [];
    if (
      positionData &&
      (!positionData.totalXAmount.isZero() ||
        !positionData.totalYAmount.isZero())
    ) {
      assets.push(
        tokenPriceToAssetToken(
          tokenPriceX.address,
          positionData.totalXAmount
            .dividedBy(10 ** tokenPriceX.decimals)
            .toNumber(),
          NetworkId.solana,
          tokenPriceX
        )
      );

      assets.push(
        tokenPriceToAssetToken(
          tokenPriceY.address,
          positionData.totalYAmount
            .dividedBy(10 ** tokenPriceY.decimals)
            .toNumber(),
          NetworkId.solana,
          tokenPriceY
        )
      );

      if (positionData.feeX.isGreaterThan(0))
        rewardAssets.push(
          tokenPriceToAssetToken(
            tokenPriceX.address,
            positionData.feeX.dividedBy(10 ** tokenPriceX.decimals).toNumber(),
            NetworkId.solana,
            tokenPriceX
          )
        );

      if (positionData.feeY.isGreaterThan(0))
        rewardAssets.push(
          tokenPriceToAssetToken(
            tokenPriceY.address,
            positionData.feeY.dividedBy(10 ** tokenPriceY.decimals).toNumber(),
            NetworkId.solana,
            tokenPriceY
          )
        );

      if (positionData.rewardOne.isGreaterThan(0) && tokenPriceRewardX)
        rewardAssets.push(
          tokenPriceToAssetToken(
            tokenPriceRewardX.address,
            positionData.rewardOne
              .dividedBy(10 ** tokenPriceRewardX.decimals)
              .toNumber(),
            NetworkId.solana,
            tokenPriceRewardX
          )
        );

      if (positionData.rewardTwo.isGreaterThan(0) && tokenPriceRewardY)
        rewardAssets.push(
          tokenPriceToAssetToken(
            tokenPriceRewardY.address,
            positionData.rewardTwo
              .dividedBy(10 ** tokenPriceRewardY.decimals)
              .toNumber(),
            NetworkId.solana,
            tokenPriceRewardY
          )
        );

      const liquidities: PortfolioLiquidity[] = [
        {
          assets,
          assetsValue: getUsdValueSum(assets.map((asset) => asset.value)),
          rewardAssets,
          rewardAssetsValue: getUsdValueSum(
            rewardAssets.map((asset) => asset.value)
          ),
          value: getUsdValueSum(
            [...assets, ...rewardAssets].map((asset) => asset.value)
          ),
          yields: [],
          ref: account.pubkey.toString(),
          sourceRefs: [{ name: 'Pool', address: lbPair.toString() }],
          link: `https://app.meteora.ag/dlmm/${lbPair.toString()}`,
        },
      ];

      const tags = [];
      if (
        positionData.totalXAmount.isZero() ||
        positionData.totalYAmount.isZero()
      )
        tags.push('Out Of Range');

      elements.push({
        type: PortfolioElementType.liquidity,
        label: 'LiquidityPool',
        networkId: NetworkId.solana,
        platformId,
        value: getUsdValueSum(liquidities.map((a) => a.value)),
        name: 'DLMM',
        data: {
          liquidities,
        },
        tags,
      });
    }
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-dlmm-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
