import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { USDC_MINT } from '@bonfida/spl-name-service';
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { poolStruct } from './structs/pool';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getPoolPda } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  // Trying to get https://solscan.io/account/4g5zooignaoVrS6NdUWEcNLxZmJGN9UJBAGtrUiBwieF

  const pda = getPoolPda(new PublicKey(owner));

  const poolAccount = await getParsedAccountInfo(client, poolStruct, pda);

  const tokenPriceById = await getTokenPricesMap(
    [USDC_MINT.toString(), WRAPPED_SOL_MINT.toString()],
    NetworkId.solana,
    cache
  );
  if (!poolAccount || poolAccount.totalAmount.isZero()) return [];

  const usdcTokenPrice = tokenPriceById.get(USDC_MINT.toString());

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const amount = poolAccount.totalAmount.dividedBy(10 ** 6).toNumber();
  suppliedAssets.push(
    tokenPriceToAssetToken(
      USDC_MINT.toString(),
      amount,
      NetworkId.solana,
      usdcTokenPrice
    )
  );

  if (suppliedAssets.length === 0 && borrowedAssets.length === 0) return [];

  const { borrowedValue, collateralRatio, suppliedValue, value } =
    getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

  return [
    {
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        collateralRatio,
        rewardAssets,
        value,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-pools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
