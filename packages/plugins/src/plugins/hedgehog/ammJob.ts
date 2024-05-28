import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { ammPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { TokenSwap, swapStruct, tokenSwapStruct } from './structs';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(client, swapStruct, ammPid, [
    {
      dataSize: swapStruct.byteSize,
    },
  ]);
  if (accounts.length === 0) return;
  const tokenSwapAddresses = accounts.map((a) => a.underlyingSwap);
  const tokenSwapAccounts = (
    await getParsedMultipleAccountsInfo(
      client,
      tokenSwapStruct,
      tokenSwapAddresses
    )
  ).filter((a) => a !== null) as ParsedAccount<TokenSwap>[];

  // Token accounts
  const tokenAccountAddresses = tokenSwapAccounts
    .map((a) => [a.tokenAccountA, a.tokenAccountB])
    .flat();
  const tokenAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    tokenAccountAddresses
  );
  const tokenAccountsMap: Map<string, ParsedAccount<TokenAccount>> = new Map();
  tokenAccounts.forEach((a) => {
    if (!a) return;
    tokenAccountsMap.set(a.pubkey.toString(), a);
  });

  // Mint accounts
  const mintAddresses = tokenSwapAccounts
    .map((a) => [a.mintA, a.mintB, a.tokenPool])
    .flat();
  const mintAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    mintAddresses
  );
  const mintAccountsMap: Map<string, ParsedAccount<MintAccount>> = new Map();
  mintAccounts.forEach((a) => {
    if (!a) return;
    mintAccountsMap.set(a.pubkey.toString(), a);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenSwapAccounts.map((a) => a.tokenPool.toString()),
    NetworkId.solana
  );

  const sources: TokenPriceSource[] = [];
  for (let i = 0; i < tokenSwapAccounts.length; i++) {
    const acc = tokenSwapAccounts[i];

    const poolMint = mintAccountsMap.get(acc.tokenPool.toString());
    if (!poolMint) continue;

    const mintA = mintAccountsMap.get(acc.mintA.toString());
    const mintB = mintAccountsMap.get(acc.mintB.toString());
    if (!mintA || !mintB) continue;

    const tokenAccountA = tokenAccountsMap.get(acc.tokenAccountA.toString());
    const tokenAccountB = tokenAccountsMap.get(acc.tokenAccountB.toString());
    if (!tokenAccountA || !tokenAccountB) continue;
    if (tokenAccountA.amount.isZero()) continue;
    if (tokenAccountB.amount.isZero()) continue;

    const tokenPrice = tokenPrices.get(acc.tokenPool.toString());

    const sourceA = getLpTokenSourceRaw({
      priceUnderlyings: false,
      elementName: 'Hedgehog AMM',
      liquidityName: 'Bet - YES',
      networkId: NetworkId.solana,
      platformId,
      sourceId: platformId,
      lpDetails: {
        address: mintA.pubkey.toString(),
        decimals: mintA.decimals,
        supplyRaw: mintA.supply,
      },
      poolUnderlyingsRaw: [
        {
          address: tokenAccountA.mint.toString(),
          decimals: poolMint.decimals,
          reserveAmountRaw: tokenAccountA.amount,
          weight: 1,
          tokenPrice,
        },
      ],
    });
    const sourceB = getLpTokenSourceRaw({
      priceUnderlyings: false,
      elementName: 'Hedgehog AMM',
      liquidityName: 'Bet - NO',
      networkId: NetworkId.solana,
      platformId,
      sourceId: platformId,
      lpDetails: {
        address: mintB.pubkey.toString(),
        decimals: mintB.decimals,
        supplyRaw: mintB.supply,
      },
      poolUnderlyingsRaw: [
        {
          address: tokenAccountB.mint.toString(),
          decimals: poolMint.decimals,
          reserveAmountRaw: tokenAccountB.amount,
          weight: 1,
          tokenPrice,
        },
      ],
    });
    sources.push(...sourceA, ...sourceB);
  }
  console.log('sources:', sources);
  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-amm`,
  executor,
  label: 'normal',
};
export default job;
