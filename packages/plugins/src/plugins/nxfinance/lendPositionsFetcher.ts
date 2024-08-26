import {
  aprToApy,
  getUsdValueSum,
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  lendingPoolKey,
  lendProgramId,
  nxfinanceLendIdlItem,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getAutoParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { LendingAccount, LendingPool } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { formatLendingPool } from './helpers';

const lendingPoolsMemo = new MemoizedCache<ParsedAccount<LendingPool>[]>(
  lendingPoolKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const lendingPools = await lendingPoolsMemo.getItem(cache);

  if (!lendingPools) return [];

  const lendingAccountsPublicKeys = lendingPools.map(
    (lendingPool) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('lending_account'),
          new PublicKey(lendingPool.nxMarket).toBuffer(),
          PublicKey.findProgramAddressSync(
            [
              Buffer.from('lending_pool'),
              new PublicKey(lendingPool.nxMarket).toBuffer(),
              new PublicKey(lendingPool.tokenMint).toBuffer(),
            ],
            lendProgramId
          )[0].toBuffer(),
          new PublicKey(owner).toBuffer(),
        ],
        lendProgramId
      )[0]
  );

  const lendingAccounts = (
    await getAutoParsedMultipleAccountsInfo<LendingAccount>(
      connection,
      nxfinanceLendIdlItem,
      lendingAccountsPublicKeys
    )
  ).filter((acc) => acc !== null && acc.depositNotes !== '0');

  if (lendingAccounts.length === 0) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    lendingPools.map((lp) => lp.tokenMint),
    NetworkId.solana
  );

  const liquidities: PortfolioLiquidity[] = [];

  lendingAccounts.forEach((lendingAccount) => {
    if (!lendingAccount) return;
    const lendingPool = lendingPools.find(
      (lp) => lp.nxMarket === lendingAccount.nxMarket
    );
    if (!lendingPool) return;

    const tokenPrice = tokenPrices.get(lendingPool.tokenMint);

    if (!tokenPrice) return;

    const formattedLendingPool = formatLendingPool(
      lendingPools[0],
      tokenPrice.decimals
    );

    const asset = tokenPriceToAssetToken(
      tokenPrice.address,
      new BigNumber(lendingAccount.depositNotes)
        .multipliedBy(formattedLendingPool.depositNoteRate)
        .dividedBy(10 ** tokenPrice.decimals)
        .toNumber(),
      NetworkId.solana,
      tokenPrice
    );

    const { value } = asset;

    liquidities.push({
      assets: [asset],
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: 0,
      value,
      yields: [
        {
          apr: formattedLendingPool.APR,
          apy: aprToApy(formattedLendingPool.APR),
        },
      ],
    });
  });

  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      name: 'GMS Lending Pool',
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-lend-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
