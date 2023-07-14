import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { Metaplex, PublicKey } from '@metaplex-foundation/js';
import { platformId, whirlpoolPrefix, whirlpoolProgram } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
} from '../../utils/solana';
import { Whirlpool, positionStruct } from './structs/whirlpool';
import {
  getTokenAmountsFromLiquidity,
  tickIndexToSqrtPriceX64,
} from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const metaplex = new Metaplex(client);
  if (!owner) return [];
  const nfts = await metaplex.nfts().findAllByOwner({
    owner: new PublicKey(owner),
  });
  const positionsProgramAddress: PublicKey[] = [];
  nfts.forEach((nft) => {
    if (nft && nft.name === 'Orca Whirlpool Position') {
      const address =
        nft.model === 'metadata'
          ? new PublicKey(nft.mintAddress.toString())
          : new PublicKey(nft.mint.address.toString());

      const positionSeed = [Buffer.from('position'), address.toBuffer()];

      const [positionPublicKey] = PublicKey.findProgramAddressSync(
        positionSeed,
        whirlpoolProgram
      );
      positionsProgramAddress.push(positionPublicKey);
    }
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

  // TODO : improve once we have getItems(string[])
  const allWhirlpoolsInfo = await cache.getItems<ParsedAccount<Whirlpool>>({
    prefix: whirlpoolPrefix,
    networkId: NetworkId.solana,
  });
  const tokensMints: string[] = [];
  const whirlpoolMap: Map<string, Whirlpool> = new Map();
  allWhirlpoolsInfo.forEach((wInfo) => {
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
      positionInfo.liquidity.toNumber(),
      tickIndexToSqrtPriceX64(whirlpoolInfo.tickCurrentIndex),
      tickIndexToSqrtPriceX64(positionInfo.tickLowerIndex),
      tickIndexToSqrtPriceX64(positionInfo.tickUpperIndex),
      0
    );

    const tokenPriceA = tokenPrices.get(whirlpoolInfo.tokenMintA.toString());
    if (!tokenPriceA) continue;

    const assetTokenA = tokenPriceToAssetToken(
      whirlpoolInfo.tokenMintA.toString(),
      tokenAmountA / 10 ** tokenPriceA.decimals,
      NetworkId.solana,
      tokenPriceA
    );
    const tokenPriceB = tokenPrices.get(whirlpoolInfo.tokenMintB.toString());
    if (!tokenPriceB) continue;

    const assetTokenB = tokenPriceToAssetToken(
      whirlpoolInfo.tokenMintB.toString(),
      tokenAmountB / 10 ** tokenPriceB.decimals,
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
      platformId: 'orca',
      label: 'LiquidityPool',
      tags: ['Concentrated'],
      value: totalLiquidityValue,
      data: {
        liquidities: assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-clmm-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
