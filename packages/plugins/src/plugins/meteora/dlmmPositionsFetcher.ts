import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { dlmmProgramId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  tokenAccountStruct,
} from '../../utils/solana';
import {
  BinArray,
  LbPair,
  binArrayStruct,
  dlmmPositionV1Struct,
  dlmmPositionV2Struct,
  lbPairStruct,
} from './struct';
import {
  dlmmPositionAccountFilter,
  dlmmPositionV2AccountFilter,
} from './filters';
import {
  binIdToBinArrayIndex,
  deriveBinArray,
  processPosition,
} from './dlmmHelper';
import { PositionVersion } from './types';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userPubKey = new PublicKey(owner);

  const positionsV1 = await getParsedProgramAccounts(
    client,
    dlmmPositionV1Struct,
    dlmmProgramId,
    dlmmPositionAccountFilter(userPubKey.toString())
  );

  const positionsV2 = await getParsedProgramAccounts(
    client,
    dlmmPositionV2Struct,
    dlmmProgramId,
    dlmmPositionV2AccountFilter(userPubKey.toString())
  );

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
      lbPairById.set(lbPairKeys[i - binArrayKeys.length].toBase58(), lbPairAcc);
    }
  }

  const tokenPrices = await cache.getTokenPrices(
    Array.from(mints),
    NetworkId.solana
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokenPrices) {
    if (tokenPrice) tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  const reservePublicKeys = Array.from(lbPairById.values())
    .map(({ reserveX, reserveY }) => [reserveX, reserveY])
    .flat();

  const reserveAccountsInfo = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    reservePublicKeys
  );

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

  const liquidities: PortfolioLiquidity[] = [];

  for (let idx = 0; idx < positions.length; idx++) {
    const position = positions[idx];
    const account = position;

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
      liquidities.push({
        assets,
        assetsValue: getUsdValueSum(assets.map((asset) => asset.value)),
        rewardAssets: [],
        rewardAssetsValue: null,
        value: getUsdValueSum(assets.map((asset) => asset.value)),
        yields: [],
      });
    }
  }

  if (liquidities.length === 0) return [];
  return [
    {
      type: PortfolioElementType.liquidity,
      label: 'LiquidityPool',
      networkId: NetworkId.solana,
      platformId,
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      name: 'DLMM',
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-dlmm-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
