import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { AMM_PROGRAM_ID_V4, platformId } from './constants';
import { ammInfoV4Struct } from './structs/amms';
import {
  MintAccount,
  TokenAccount,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { ammV4Filter } from './filters';
import { LiquidityPoolStatus } from './types';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { CLOBOrderStruct } from '../orders/clobs-solana/structs';
import { orderStructByProgramId } from '../orders/clobs-solana/constants';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const ammsDetails = [
  {
    versionId: 4,
    struct: ammInfoV4Struct,
    programId: AMM_PROGRAM_ID_V4,
    filters: ammV4Filter,
    name: 'Pools V4',
  },
  // {
  //   versionId: 5,
  //   struct: ammInfoV5Struct,
  //   programId: AMM_PROGRAM_ID_V5,
  //   filters: ammV5Filter,
  //   name: 'Pools V5',
  // },
];

/**
 * @deprecated
 * This function has been deprecated. Use the raydium-lp-tokens-api fetcher instead.
 */
const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const tokenPriceSources = [];

  for (let id = 0; id < ammsDetails.length; id++) {
    const ammDetails = ammsDetails[id];
    const { struct, programId, filters, versionId, name: ammName } = ammDetails;

    const allPoolsPubkeys = await client.getProgramAccounts(programId, {
      filters,
      dataSlice: { offset: 0, length: 0 },
    });
    let poolsBuffers;
    let cAmms;
    let ammsAccounts;
    let accountsRes;
    const step = 100;
    for (let offset = 0; offset < allPoolsPubkeys.length; offset += step) {
      poolsBuffers = await client.getMultipleAccountsInfo(
        allPoolsPubkeys.slice(offset, offset + step).map((res) => res.pubkey)
      );

      cAmms = poolsBuffers
        .map((poolBuffer) => {
          if (poolBuffer)
            return {
              ...struct.deserialize(poolBuffer.data)[0],
              versionId,
              ammName,
            };
          return [];
        })
        .flat();

      ammsAccounts = cAmms.filter((a) => {
        if (a.status.toNumber() === LiquidityPoolStatus.Disabled) return false;
        if (a.status.toNumber() === LiquidityPoolStatus.Uninitialized)
          return false;
        if (a.lpMintAddress.toString() === '11111111111111111111111111111111')
          return false;
        if (a.pcMintAddress.toString() === a.serumMarket.toString())
          return false;
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
      const ammsOpenOrdersMap: Map<string, CLOBOrderStruct> = new Map();
      const mintAccountsMap: Map<string, MintAccount> = new Map();
      accountsRes = await getMultipleAccountsInfoSafe(client, addresses);
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
        const orderStruct = orderStructByProgramId.get(
          ammsAccounts[i / 4].serumProgramId.toString()
        );
        if (!orderStruct) continue;

        ammsOpenOrdersMap.set(
          addresses[i + 2].toString(),
          orderStruct.deserialize(ammOpenOrdersInfo.data)[0]
        );
        mintAccountsMap.set(
          addresses[i + 3].toString(),
          mintAccountStruct.deserialize(lpMintAddressInfo.data)[0]
        );
      }

      const tokenPrices = await cache.getTokenPricesAsMap(
        mints,
        NetworkId.solana
      );

      for (let i = 0; i < ammsAccounts.length; i += 1) {
        const amm = ammsAccounts[i];

        const mintA = amm.coinMintAddress.toString();
        const mintB = amm.pcMintAddress.toString();

        const tokenAccountA = tokenAccountsMap.get(
          amm.poolCoinTokenAccount.toString()
        );
        const tokenAccountB = tokenAccountsMap.get(
          amm.poolPcTokenAccount.toString()
        );
        const ammOpenOrders = ammsOpenOrdersMap.get(
          amm.ammOpenOrders.toString()
        );

        if (!tokenAccountA || !tokenAccountB || !ammOpenOrders) continue;
        let tokenAmountAWei = tokenAccountA.amount;
        let tokenAmountBWei = tokenAccountB.amount;

        const { baseTokenTotal, quoteTokenTotal } = ammOpenOrders;
        tokenAmountAWei = tokenAmountAWei.plus(baseTokenTotal);
        tokenAmountBWei = tokenAmountBWei.plus(quoteTokenTotal);
        if (tokenAmountAWei.isZero() && tokenAmountBWei.isZero()) continue;

        const decimalsA = amm.coinDecimals.toNumber();
        const decimalsB = amm.pcDecimals.toNumber();

        const { needTakePnlCoin, needTakePnlPc } = amm;
        tokenAmountAWei = tokenAmountAWei.minus(needTakePnlCoin);
        tokenAmountBWei = tokenAmountBWei.minus(needTakePnlPc);

        const tokenAmountA = tokenAmountAWei;
        const tokenAmountB = tokenAmountBWei;

        const [tokenPriceA, tokenPriceB] = [
          tokenPrices.get(mintA),
          tokenPrices.get(mintB),
        ];

        const lpMint = amm.lpMintAddress;

        const lpMintAccount = mintAccountsMap.get(lpMint.toString());
        if (!lpMintAccount) continue;

        const lpDecimals = lpMintAccount.decimals;
        const lpSupply = amm.lpAmount;
        if (lpSupply.isZero()) continue;

        const tokenSources = getLpTokenSourceRaw({
          networkId: NetworkId.solana,
          sourceId: lpMint.toString(),
          platformId,
          priceUnderlyings: true,
          lpDetails: {
            address: lpMint.toString(),
            decimals: lpDecimals,
            supplyRaw: lpSupply,
          },
          poolUnderlyingsRaw: [
            {
              address: mintA,
              decimals: decimalsA,
              reserveAmountRaw: tokenAmountA,
              tokenPrice: tokenPriceA,
              weight: 0.5,
            },
            {
              address: mintB,
              decimals: decimalsB,
              reserveAmountRaw: tokenAmountB,
              tokenPrice: tokenPriceB,
              weight: 0.5,
            },
          ],
        });

        tokenPriceSources.push(...tokenSources);
      }
    }
  }

  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
