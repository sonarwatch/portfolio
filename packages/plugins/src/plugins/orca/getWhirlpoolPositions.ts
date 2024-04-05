import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, whirlpoolPrefix, whirlpoolProgram } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
} from '../../utils/solana';
import { Cache } from '../../Cache';
import { Whirlpool, positionStruct } from './structs/whirlpool';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';

export async function getWhirlpoolPositions(
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
      whirlpoolProgram
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

  const allWhirlpoolsInfo = await cache.getItems<ParsedAccount<Whirlpool>>(
    Array.from(whirlpoolAddresses),
    {
      prefix: whirlpoolPrefix,
      networkId: NetworkId.solana,
    }
  );
  const tokensMints: string[] = [];
  const whirlpoolMap: Map<string, Whirlpool> = new Map();
  allWhirlpoolsInfo.forEach((wInfo) => {
    if (!wInfo) return;
    if (whirlpoolAddresses.has(wInfo.pubkey.toString())) {
      whirlpoolMap.set(wInfo.pubkey.toString(), wInfo);
      tokensMints.push(
        wInfo.tokenMintA.toString(),
        wInfo.tokenMintB.toString()
      );
    }
  });

  const tokenPriceResults = await runInBatch(
    tokensMints.map((mint) => () => cache.getTokenPrice(mint, NetworkId.solana))
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  if (whirlpoolMap.size === 0) return [];

  const assets: PortfolioLiquidity[] = [];
  let totalLiquidityValue = 0;
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

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      positionInfo.liquidity,
      whirlpoolInfo.tickCurrentIndex,
      positionInfo.tickLowerIndex,
      positionInfo.tickUpperIndex,
      false
    );

    const tokenPriceA = tokenPrices.get(whirlpoolInfo.tokenMintA.toString());
    if (!tokenPriceA) continue;

    const assetTokenA = tokenPriceToAssetToken(
      whirlpoolInfo.tokenMintA.toString(),
      tokenAmountA.dividedBy(10 ** tokenPriceA.decimals).toNumber(),
      NetworkId.solana,
      tokenPriceA
    );
    const tokenPriceB = tokenPrices.get(whirlpoolInfo.tokenMintB.toString());
    if (!tokenPriceB) continue;

    const assetTokenB = tokenPriceToAssetToken(
      whirlpoolInfo.tokenMintB.toString(),
      tokenAmountB.dividedBy(10 ** tokenPriceB.decimals).toNumber(),
      NetworkId.solana,
      tokenPriceB
    );
    if (
      !assetTokenA ||
      !assetTokenB ||
      assetTokenA.value === null ||
      assetTokenB.value === null
    )
      continue;

    const value = assetTokenA.value + assetTokenB.value;
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
  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.solana,
      platformId,
      label: 'LiquidityPool',
      name: 'Concentrated',
      value: totalLiquidityValue,
      data: {
        liquidities: assets,
      },
    },
  ];
}
