import { PublicKey } from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import {
  NetworkId,
  TokenPrice,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { platformId, SABER_SWAPS } from './constants';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { tokenAccountStruct, mintAccountStruct } from '../../utils/solana';
import { SaberSwap } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const swapsResponse: AxiosResponse<SaberSwap[]> | null = await axios
    .get(SABER_SWAPS)
    .catch(() => null);
  if (!swapsResponse) return;
  const swaps = swapsResponse.data;

  const accounts = [];
  for (let i = 0; i < swaps.length; i++) {
    const reserveA = swaps[i].addresses.reserves[0];
    const reserveB = swaps[i].addresses.reserves[1];
    const lpMint = swaps[i].addresses.lpTokenMint;

    accounts.push(new PublicKey(reserveA));
    accounts.push(new PublicKey(reserveB));
    accounts.push(new PublicKey(lpMint));
  }

  const accountInfos = await getMultipleAccountsInfoSafe(client, accounts);

  const mints: Set<string> = new Set();
  for (let i = 0; i < swaps.length; i++) {
    const reserveAInfo = accountInfos[i * 3];
    const reserveBInfo = accountInfos[i * 3 + 1];
    const lpMintInfo = accountInfos[i * 3 + 2];

    if (!reserveAInfo || !reserveBInfo || !lpMintInfo) continue;

    const reserveA = tokenAccountStruct.deserialize(reserveAInfo.data)[0];
    const reserveB = tokenAccountStruct.deserialize(reserveBInfo.data)[0];
    mints.add(reserveA.mint.toString());
    mints.add(reserveB.mint.toString());
  }

  const tokenPricesAsArray = await cache.getTokenPrices(
    Array.from(mints),
    NetworkId.solana
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPricesAsArray.forEach((tokenPrice) => {
    if (!tokenPrice) return;
    tokenPrices.set(tokenPrice.address, tokenPrice);
  });

  for (let i = 0; i < swaps.length; i++) {
    const swap = swaps[i];
    const reserveAInfo = accountInfos[i * 3];
    const reserveBInfo = accountInfos[i * 3 + 1];
    const lpMintInfo = accountInfos[i * 3 + 2];

    if (!reserveAInfo || !reserveBInfo || !lpMintInfo) continue;

    const reserveA = tokenAccountStruct.deserialize(reserveAInfo.data)[0];
    const reserveB = tokenAccountStruct.deserialize(reserveBInfo.data)[0];
    const lpMint = mintAccountStruct.deserialize(lpMintInfo.data)[0];
    if (lpMint.supply.isZero()) continue;

    const priceA = tokenPrices.get(reserveA.mint.toBase58());
    const priceB = tokenPrices.get(reserveB.mint.toBase58());

    if (!priceA || !priceB) continue;

    const coinValue = reserveA.amount
      .multipliedBy(priceA.price)
      .div(10 ** priceA.decimals);
    const pcValue = reserveB.amount
      .multipliedBy(priceB.price)
      .div(10 ** priceB.decimals);

    const lpTokenPrice = coinValue
      .plus(pcValue)
      .div(lpMint.supply)
      .times(10 ** lpMint.decimals);

    const underlyings: TokenPriceUnderlying[] = [
      {
        networkId: NetworkId.solana,
        address: priceA.address,
        decimals: priceA.decimals,
        price: priceA.price,
        amountPerLp: reserveA.amount.div(lpMint.supply).toNumber(),
      },
      {
        networkId: NetworkId.solana,
        address: priceB.address,
        decimals: priceB.decimals,
        price: priceB.price,
        amountPerLp: reserveB.amount.div(lpMint.supply).toNumber(),
      },
    ];

    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: swap.addresses.lpTokenMint,
      networkId: NetworkId.solana,
      platformId,
      decimals: lpMint.decimals,
      price: lpTokenPrice.toNumber(),
      underlyings,
      timestamp: Date.now(),
      sourceRefs: [{ address: swap.addresses.swapAccount, name: 'Pool' }],
    });
  }
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
