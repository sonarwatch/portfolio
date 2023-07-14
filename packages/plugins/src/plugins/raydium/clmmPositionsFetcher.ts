import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { Metaplex, PublicKey } from '@metaplex-foundation/js';
import { clmmNFTName, platformId, raydiumProgram } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getAmountsFromLiquidity, tickIndexToSqrtPriceX64 } from './helpers';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import {
  personalPositionStateStruct,
  poolStateStruct,
} from './structs/clmmPositions';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const metaplex = new Metaplex(client);

  const nfts = await metaplex.nfts().findAllByOwner({
    owner: new PublicKey(owner),
  });

  const positionsProgramAddress: PublicKey[] = [];
  nfts.forEach((nft) => {
    if (nft && nft.name === clmmNFTName) {
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
    }
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

  // Do we have a problem if we have multiple positions on the same pool ? Seems not.
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
    const { tokenAmountA, tokenAmountB } = getAmountsFromLiquidity(
      personalPositionInfo.liquidity,
      tickIndexToSqrtPriceX64(poolStateInfo.tickCurrent),
      tickIndexToSqrtPriceX64(personalPositionInfo.tickLowerIndex),
      tickIndexToSqrtPriceX64(personalPositionInfo.tickUpperIndex),
      true
    );
    if (!tokenAmountA || !tokenAmountB) continue;
    const tokenPriceA = await cache.getTokenPrice(
      poolStateInfo.tokenMint0.toString(),
      NetworkId.solana
    );
    if (!tokenPriceA) continue;
    const assetTokenA = tokenPriceToAssetToken(
      poolStateInfo.tokenMint0.toString(),
      tokenAmountA.toNumber() / 10 ** tokenPriceA.decimals,
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
      tokenAmountB.toNumber() / 10 ** tokenPriceB.decimals,
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
    platformId: 'raydium',
    label: 'LiquidityPool',
    tags: ['Concentrated'],
    value: totalLiquidityValue,
    data: {
      liquidities: assets,
    },
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-clmm-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
