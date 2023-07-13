import {
  Cache,
  Job,
  JobExecutor,
  NetworkId,
  TokenPrice,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@metaplex-foundation/js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { AMM_PROGRAM_ID_V4, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { OpenOrdersV2, ammInfoV4Struct, openOrdersV2Struct } from './structs';
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
import { isMintAccount, isOpenOrderAccount, isTokenAccount } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  // AMM V4
  const ammV4Accounts = await getParsedProgramAccounts(
    client,
    ammInfoV4Struct,
    AMM_PROGRAM_ID_V4,
    ammV4Filter
  );
  const mints: string[] = [];
  const addresses: PublicKey[] = [];
  const structs: (
    | BeetStruct<TokenAccount>
    | BeetStruct<OpenOrdersV2>
    | BeetStruct<MintAccount>
  )[] = [];

  for (let i = 0; i < ammV4Accounts.length; i += 1) {
    const amm = ammV4Accounts[i];

    if (amm.lpMintAddress.toString() === '11111111111111111111111111111111')
      continue;

    mints.push(amm.coinMintAddress.toString(), amm.pcMintAddress.toString());

    addresses.push(
      amm.poolCoinTokenAccount,
      amm.poolPcTokenAccount,
      amm.ammOpenOrders,
      amm.lpMintAddress
    );
    structs.push(
      tokenAccountStruct,
      tokenAccountStruct,
      openOrdersV2Struct,
      mintAccountStruct
    );
  }

  const tokenPriceResults = await runInBatch(
    mints.map((mint) => () => cache.getTokenPrice(mint, NetworkId.solana))
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  const accountRes = await getMultipleAccountsInfoSafe(client, addresses);
  if (!accountRes) return;
  if (accountRes.length !== structs.length) return;
  const accountByAddress: Map<
    string,
    TokenAccount | OpenOrdersV2 | MintAccount
  > = new Map();
  for (let index = 0; index < accountRes.length; index++) {
    const account = accountRes[index];
    const struct = structs[index];
    const address = addresses[index];
    if (!account || !struct || !address) continue;
    const deserializedAccount = struct.deserialize(account.data)[0];
    accountByAddress.set(address.toString(), deserializedAccount);
  }

  for (let i = 0; i < ammV4Accounts.length; i += 1) {
    const underlyings: TokenPriceUnderlying[] = [];
    const amm = ammV4Accounts[i];
    if (
      [
        LiquidityPoolStatus.Disabled,
        LiquidityPoolStatus.Uninitialized,
      ].includes(amm.status.toNumber())
    )
      continue;
    if (amm.lpMintAddress.toString() === '11111111111111111111111111111111')
      continue;
    if (amm.pcMintAddress.toString() === amm.serumMarket.toString()) continue;

    const coinTokenPrice = tokenPrices.get(amm.coinMintAddress.toString());
    const pcTokenPrice = tokenPrices.get(amm.pcMintAddress.toString());
    if (!pcTokenPrice || !coinTokenPrice) continue;

    const poolCoinTokenAccount = accountByAddress.get(
      amm.poolCoinTokenAccount.toString()
    );

    const poolPcTokenAccount = accountByAddress.get(
      amm.poolPcTokenAccount.toString()
    );
    const ammOpenOrders = accountByAddress.get(amm.ammOpenOrders.toString());
    if (!poolCoinTokenAccount || !poolPcTokenAccount || !ammOpenOrders)
      continue;

    if (
      !isTokenAccount(poolCoinTokenAccount) ||
      !isTokenAccount(poolPcTokenAccount) ||
      !isOpenOrderAccount(ammOpenOrders)
    )
      continue;
    let coinAmountWei = poolCoinTokenAccount.amount;
    let pcAmountWei = poolPcTokenAccount.amount;

    const { baseTokenTotal, quoteTokenTotal } = ammOpenOrders;
    coinAmountWei = coinAmountWei.plus(baseTokenTotal);
    pcAmountWei = pcAmountWei.plus(quoteTokenTotal);

    const { needTakePnlCoin, needTakePnlPc, coinDecimals, pcDecimals } = amm;
    coinAmountWei = coinAmountWei.minus(needTakePnlCoin);
    pcAmountWei = pcAmountWei.minus(needTakePnlPc);

    const coinAmount = coinAmountWei
      .dividedBy(10 ** coinDecimals.toNumber())
      .toNumber();

    const pcAmount = pcAmountWei
      .dividedBy(10 ** pcDecimals.toNumber())
      .toNumber();

    const coinValueLocked = coinAmount * coinTokenPrice.price;
    const pcValueLocked = pcAmount * pcTokenPrice.price;

    const lpMint = amm.lpMintAddress;
    const mintAccount = accountByAddress.get(lpMint.toString());
    if (!mintAccount) continue;
    if (!isMintAccount(mintAccount)) continue;

    const lpSupply = mintAccount?.supply.toNumber();
    const lpDecimals = mintAccount?.decimals;
    if (!lpDecimals || !lpSupply) continue;
    underlyings.push({
      networkId: NetworkId.solana,
      address: coinTokenPrice.address,
      decimals: coinTokenPrice.decimals,
      price: coinTokenPrice.price,
      amountPerLp: coinAmount / lpSupply,
    });
    underlyings.push({
      networkId: NetworkId.solana,
      address: pcTokenPrice.address,
      decimals: pcTokenPrice.decimals,
      price: pcTokenPrice.price,
      amountPerLp: pcAmount / lpSupply,
    });
    const tvl = coinValueLocked + pcValueLocked;
    if (tvl < 2000) continue;
    const price = tvl / lpSupply;

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
