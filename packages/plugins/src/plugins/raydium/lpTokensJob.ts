import {
  NetworkId,
  TokenPrice,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { AMM_PROGRAM_ID_V4, AMM_PROGRAM_ID_V5, platformId } from './constants';
import { ammInfoV4Struct, ammInfoV5Struct } from './structs/amms';
import {
  OpenOrdersV1,
  OpenOrdersV2,
  openOrdersV1Struct,
  openOrdersV2Struct,
} from './structs/openOrders';
import {
  MintAccount,
  TokenAccount,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { ammV4Filter, ammV5Filter } from './filters';
import { EnhancedAmmInfo, LiquidityPoolStatus } from './types';
import runInBatch from '../../utils/misc/runInBatch';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';

const ammsDetails = [
  {
    versionId: 4,
    struct: ammInfoV4Struct,
    programId: AMM_PROGRAM_ID_V4,
    filters: ammV4Filter,
    name: 'Pools V4',
  },
  {
    versionId: 5,
    struct: ammInfoV5Struct,
    programId: AMM_PROGRAM_ID_V5,
    filters: ammV5Filter,
    name: 'Pools V5',
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const ammsRaws: EnhancedAmmInfo[] = [];

  for (let id = 0; id < ammsDetails.length; id++) {
    const ammDetails = ammsDetails[id];
    const { struct, programId, filters, versionId, name: ammName } = ammDetails;

    const ammsRes = await client.getProgramAccounts(programId, { filters });
    const cAmms: EnhancedAmmInfo[] = ammsRes.map((poolRes) => ({
      ...struct.deserialize(poolRes.account.data)[0],
      versionId,
      ammName,
    }));
    ammsRaws.push(...cAmms);
  }

  const ammsAccounts = ammsRaws.filter((a) => {
    if (a.status.toNumber() === LiquidityPoolStatus.Disabled) return false;
    if (a.status.toNumber() === LiquidityPoolStatus.Uninitialized) return false;
    if (a.lpMintAddress.toString() === '11111111111111111111111111111111')
      return false;
    if (a.pcMintAddress.toString() === a.serumMarket.toString()) return false;
    return true;
  });

  const mints: Set<string> = new Set();
  const addresses: PublicKey[] = [];
  ammsAccounts.forEach((amm) => {
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
      ammsAccounts[i / 4].serumProgramId.toString() ===
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

  for (let i = 0; i < ammsAccounts.length; i += 1) {
    const amm = ammsAccounts[i];
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
      elementName: amm.ammName,
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  executor,
};
export default job;
