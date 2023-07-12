import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { AMM_PROGRAM_ID_V4, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  accountStruc,
  ammInfoV4Struct,
  ammInfoV5Struct,
  openOrdersV2Struct,
} from './structs';
import { getParsedProgramAccounts } from '../../utils/solana';
import { ammV4Filter } from './filters';
import { getParsedMultipleAccountsInfo } from '../../utils/solana/getParsedMultipleAccountsInfo';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  // AMM V5
  const ammV5Accounts = await getParsedProgramAccounts(
    client,
    ammInfoV4Struct,
    AMM_PROGRAM_ID_V4,
    ammV4Filter
  );
  console.log(
    'constexecutor:JobExecutor= ~ ammInfoV4Struct:',
    ammInfoV4Struct.byteSize
  );
  console.log(
    'constexecutor:JobExecutor= ~ ammV4Accounts.length:',
    ammV5Accounts.length
  );

  for (let i = 0; i < ammV5Accounts.length; i += 1) {
    const amm = ammV5Accounts[i];
    if (amm.lpMintAddress.toString() === '11111111111111111111111111111111')
      continue;
    if (amm.pcMintAddress.toString() === amm.serumMarket.toString()) continue;

    const coinPrice = await cache.getTokenPrice(
      amm.coinMintAddress.toString(),
      NetworkId.solana
    );
    const pcPrice = await cache.getTokenPrice(
      amm.pcMintAddress.toString(),
      NetworkId.solana
    );
    if (!pcPrice || !coinPrice) continue;

    const addresses = [
      amm.poolCoinTokenAccount,
      amm.poolPcTokenAccount,
      amm.ammOpenOrders,
    ];
    const accountsRes = await getParsedMultipleAccountsInfo(
      client,
      accountStruc,
      addresses
    );
    const openOrderAccountInfo = await getParsedMultipleAccountsInfo(
      client,
      openOrdersV2Struct,
      [amm.ammOpenOrders]
    );
    if (!accountsRes || !openOrderAccountInfo) return;
    const poolCoinTokenAccount = accountsRes.at(0);
    const poolPcTokenAccount = accountsRes.at(1);
    const ammOpenOrders = openOrderAccountInfo.at(0);
    if (!poolCoinTokenAccount || !poolPcTokenAccount || !ammOpenOrders)
      continue;

    let coinAmountWei = new BigNumber(poolCoinTokenAccount.amount.toString());
    let pcAmountWei = new BigNumber(poolPcTokenAccount.amount.toString());

    const { baseTokenTotal, quoteTokenTotal } = ammOpenOrders;
    coinAmountWei = coinAmountWei.plus(
      new BigNumber(baseTokenTotal.toString())
    );
    pcAmountWei = pcAmountWei.plus(new BigNumber(quoteTokenTotal.toString()));

    const { needTakePnlCoin, needTakePnlPc, coinDecimals, pcDecimals } = amm;
    coinAmountWei = coinAmountWei.minus(
      new BigNumber(needTakePnlCoin.toString())
    );
    pcAmountWei = pcAmountWei.minus(new BigNumber(needTakePnlPc.toString()));

    const coinAmount = coinAmountWei
      .dividedBy(new BigNumber(10 ** coinDecimals.toNumber()))
      .toNumber();
    const pcAmount = pcAmountWei
      .dividedBy(new BigNumber(10 ** pcDecimals.toNumber()))
      .toNumber();

    const coinValueLocked = coinAmount * coinPrice.price;
    const pcValueLocked = pcAmount * pcPrice.price;

    const lpMint = amm.lpMintAddress;
    const lpSupplyAndDecimals = await fetchTokenSupplyAndDecimals(
      lpMint,
      client,
      0
    );
    const lpSupply = lpSupplyAndDecimals?.supply;
    const lpDecimals = lpSupplyAndDecimals?.decimals;
    if (!lpDecimals || !lpSupply) continue;

    const tvl = coinValueLocked + pcValueLocked;
    if (tvl < 2000) continue;
    const value = tvl / lpSupply;

    cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: lpMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: lpDecimals,
      price: value,
      underlyings: [],
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  executor,
};
export default job;
