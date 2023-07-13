import {
  Cache,
  Job,
  JobExecutor,
  NetworkId,
  TokenPrice,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@metaplex-foundation/js';
import { AMM_PROGRAM_ID_V4, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  OpenOrdersV1,
  OpenOrdersV2,
  ammInfoV4Struct,
  openOrdersV1Struct,
  openOrdersV2Struct,
} from './structs';
import {
  MintAccount,
  TokenAccount,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { ammV4Filter } from './filters';
import { LiquidityPoolStatus } from './types';
import runInBatch from '../../utils/misc/runInBatch';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  // AMM V4
  const ammV4AccountsRaw = await getParsedProgramAccounts(
    client,
    ammInfoV4Struct,
    AMM_PROGRAM_ID_V4,
    ammV4Filter
  );
  const ammV4Accounts = ammV4AccountsRaw.filter((a) => {
    if (a.status.toNumber() === LiquidityPoolStatus.Disabled) return false;
    if (a.status.toNumber() === LiquidityPoolStatus.Uninitialized) return false;
    if (a.lpMintAddress.toString() === '11111111111111111111111111111111')
      return false;
    if (a.pcMintAddress.toString() === a.serumMarket.toString()) return false;
    return true;
  });

  const mints: Set<string> = new Set();
  const addresses: PublicKey[] = [];
  ammV4Accounts.forEach((amm) => {
    addresses.push(
      amm.poolCoinTokenAccount,
      amm.poolPcTokenAccount,
      amm.ammOpenOrders,
      amm.lpMintAddress
    );
    mints.add(amm.coinMintAddress.toString());
    mints.add(amm.pcMintAddress.toString());
  });
  const tokenAccountsMap: Map<string, TokenAccount> = new Map();
  const ammsOpenOrdersMap: Map<string, OpenOrdersV2 | OpenOrdersV1> = new Map();
  const mintAccountsMap: Map<string, MintAccount> = new Map();
  const accountsRes = await getMultipleAccountsInfoSafe(client, addresses);
  for (let i = 0; i < accountsRes.length; i += 4) {
    const poolCoinTokenAccountInfo = accountsRes[i];
    const poolPcTokenAccountInfo = accountsRes[i + 1];
    const ammOpenOrdersInfo = accountsRes[i + 2];
    const lpMintAddressInfo = accountsRes[i + 3];
    if (
      !poolCoinTokenAccountInfo ||
      !poolPcTokenAccountInfo ||
      !ammOpenOrdersInfo ||
      !lpMintAddressInfo
    )
      continue;

    tokenAccountsMap.set(
      addresses[i].toString(),
      tokenAccountStruct.deserialize(poolCoinTokenAccountInfo.data)[0]
    );
    tokenAccountsMap.set(
      addresses[i + 1].toString(),
      tokenAccountStruct.deserialize(poolPcTokenAccountInfo.data)[0]
    );
    if (
      ammV4Accounts[i / 4].serumProgramId.toString() ===
      '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
    ) {
      ammsOpenOrdersMap.set(
        addresses[i + 2].toString(),
        openOrdersV1Struct.deserialize(ammOpenOrdersInfo.data)[0]
      );
    } else {
      ammsOpenOrdersMap.set(
        addresses[i + 2].toString(),
        openOrdersV2Struct.deserialize(ammOpenOrdersInfo.data)[0]
      );
    }
    mintAccountsMap.set(
      addresses[i + 3].toString(),
      mintAccountStruct.deserialize(lpMintAddressInfo.data)[0]
    );
  }

  const tokenPriceResults = await runInBatch(
    [...mints].map((mint) => () => cache.getTokenPrice(mint, NetworkId.solana))
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  for (let i = 0; i < ammV4Accounts.length; i += 1) {
    const amm = ammV4Accounts[i];
    const coinTokenPrice = tokenPrices.get(amm.coinMintAddress.toString());
    const pcTokenPrice = tokenPrices.get(amm.pcMintAddress.toString());
    if (!pcTokenPrice || !coinTokenPrice) continue;

    const poolCoinTokenAccount = tokenAccountsMap.get(
      amm.poolCoinTokenAccount.toString()
    );
    const poolPcTokenAccount = tokenAccountsMap.get(
      amm.poolPcTokenAccount.toString()
    );
    const ammOpenOrders = ammsOpenOrdersMap.get(amm.ammOpenOrders.toString());

    if (!poolCoinTokenAccount || !poolPcTokenAccount || !ammOpenOrders)
      continue;

    let coinAmountWei = poolCoinTokenAccount.amount;
    let pcAmountWei = poolPcTokenAccount.amount;

    const { baseTokenTotal, quoteTokenTotal } = ammOpenOrders;
    coinAmountWei = coinAmountWei.plus(baseTokenTotal);
    pcAmountWei = pcAmountWei.plus(quoteTokenTotal);

    const { needTakePnlCoin, needTakePnlPc, coinDecimals, pcDecimals } = amm;
    coinAmountWei = coinAmountWei.minus(needTakePnlCoin);
    pcAmountWei = pcAmountWei.minus(needTakePnlPc);

    const coinAmount = coinAmountWei.dividedBy(10 ** coinDecimals.toNumber());
    const pcAmount = pcAmountWei.dividedBy(10 ** pcDecimals.toNumber());

    const coinValueLocked = coinAmount.multipliedBy(coinTokenPrice.price);
    const pcValueLocked = pcAmount.multipliedBy(pcTokenPrice.price);

    const lpMint = amm.lpMintAddress;
    const lpMintAccount = mintAccountsMap.get(lpMint.toString());
    if (!lpMintAccount) continue;

    const lpDecimals = lpMintAccount.decimals;
    const lpSupply = lpMintAccount.supply.div(10 ** lpDecimals);
    if (!lpDecimals || !lpSupply) continue;

    const tvl = coinValueLocked.plus(pcValueLocked);
    const price = tvl.div(lpSupply).toNumber();

    const underlyings: TokenPriceUnderlying[] = [];
    underlyings.push({
      networkId: NetworkId.solana,
      address: coinTokenPrice.address,
      decimals: coinTokenPrice.decimals,
      price: coinTokenPrice.price,
      amountPerLp: coinAmount.div(lpSupply).toNumber(),
    });
    underlyings.push({
      networkId: NetworkId.solana,
      address: pcTokenPrice.address,
      decimals: pcTokenPrice.decimals,
      price: pcTokenPrice.price,
      amountPerLp: pcAmount.div(lpSupply).toNumber(),
    });
    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: lpMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: lpDecimals,
      price,
      underlyings,
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  executor,
};
export default job;
