import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
} from '../../utils/solana';
import { platformId, tulipLendingProgramId } from './constants';
import { lendingReserveStruct } from './structs';
import { wadsDecimal } from '../save/constants';
import getLpTokenSourceOld from '../../utils/misc/getLpTokenSourceOld';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const lendingReserves = await getParsedProgramAccounts(
    client,
    lendingReserveStruct,
    tulipLendingProgramId,
    [
      {
        dataSize: 622,
      },
    ]
  );

  const mints: Set<string> = new Set();
  const collatMint: PublicKey[] = [];
  lendingReserves.forEach((reserve) => {
    if (
      reserve.liquidity.mintPubKey.toString() !==
      '11111111111111111111111111111111'
    ) {
      mints.add(reserve.liquidity.mintPubKey.toString());
    }
    if (
      reserve.liquidity.collateralMint.toString() !==
      '11111111111111111111111111111111'
    ) {
      collatMint.push(reserve.liquidity.collateralMint);
    }
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const mintAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    collatMint
  );
  const mintAccountById: Map<string, MintAccount> = new Map();
  mintAccounts.forEach((mA) =>
    mA ? mintAccountById.set(mA.pubkey.toString(), mA) : undefined
  );

  const promises = [];
  for (let i = 0; i < lendingReserves.length; i += 1) {
    const reserve = lendingReserves[i];
    if (reserve.lendingMarket.toString() === '11111111111111111111111111111111')
      continue;

    const mint = reserve.liquidity.mintPubKey.toString();
    const lpMint = reserve.liquidity.collateralMint.toString();
    const tokenPrice = tokenPriceById.get(mint);
    if (!tokenPrice) continue;

    // Assets amounts
    const borrowedAmount = reserve.liquidity.borrowedAmountWads
      .dividedBy(10 ** wadsDecimal)
      .dividedBy(10 ** tokenPrice.decimals);
    const platformAmount = reserve.liquidity.platformAmountWads
      .dividedBy(10 ** wadsDecimal)
      .dividedBy(10 ** tokenPrice.decimals);
    const availableAmount = reserve.liquidity.availableAmount.dividedBy(
      10 ** tokenPrice.decimals
    );

    const totalSupply = availableAmount
      .plus(borrowedAmount)
      .minus(platformAmount)
      .toNumber();

    const mintAccount = mintAccountById.get(lpMint);
    if (!mintAccount) continue;

    const { supply, decimals } = mintAccount;
    if (supply.isZero()) continue;

    const lpTokenSource = getLpTokenSourceOld(
      NetworkId.solana,
      lpMint,
      platformId,
      {
        address: lpMint.toString(),
        decimals,
        supply: supply.dividedBy(10 ** decimals).toNumber(),
      },
      [
        {
          ...tokenPrice,
          reserveAmount: totalSupply,
        },
      ]
    );

    promises.push(cache.setTokenPriceSource(lpTokenSource));
  }

  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-lending-tokens`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
