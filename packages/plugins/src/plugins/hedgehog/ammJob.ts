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
  usdcSolanaMint,
  usdcSolanaDecimals,
} from '../../utils/solana';
import {
  Market,
  Outcome,
  TokenSwap,
  marketStruct,
  swapStruct,
  tokenSwapStruct,
} from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const usdcTokenPrice = await cache.getTokenPrice(
    usdcSolanaMint,
    NetworkId.solana
  );
  if (!usdcTokenPrice) return;

  const accounts = await getParsedProgramAccounts(client, swapStruct, ammPid, [
    {
      dataSize: swapStruct.byteSize,
    },
  ]);
  if (accounts.length === 0) return;

  // Markets
  const marketAddresses = accounts.map((a) => a.market);
  const marketAccounts = (
    await getParsedMultipleAccountsInfo(client, marketStruct, marketAddresses)
  ).filter((a) => a !== null) as ParsedAccount<Market>[];
  const marketAccountsMap: Map<string, ParsedAccount<Market>> = new Map();
  marketAccounts.forEach((a) => {
    marketAccountsMap.set(a.pubkey.toString(), a);
  });

  // Token Swap
  const tokenSwapAddresses = accounts.map((a) => a.underlyingSwap);
  const tokenSwapAccounts = (
    await getParsedMultipleAccountsInfo(
      client,
      tokenSwapStruct,
      tokenSwapAddresses
    )
  ).filter((a) => a !== null) as ParsedAccount<TokenSwap>[];
  const tokenSwapAccountsMap: Map<string, ParsedAccount<TokenSwap>> = new Map();
  tokenSwapAccounts.forEach((a) => {
    tokenSwapAccountsMap.set(a.pubkey.toString(), a);
  });

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

  const sources: TokenPriceSource[] = [];
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];

    const tsAcc = tokenSwapAccountsMap.get(acc.underlyingSwap.toString());
    const marketAcc = marketAccountsMap.get(acc.market.toString());
    if (!marketAcc || !tsAcc) continue;

    const poolMint = mintAccountsMap.get(tsAcc.tokenPool.toString());
    if (!poolMint) continue;

    const mintA = mintAccountsMap.get(tsAcc.mintA.toString());
    const mintB = mintAccountsMap.get(tsAcc.mintB.toString());
    if (!mintA || !mintB) continue;

    const tokenAccountA = tokenAccountsMap.get(tsAcc.tokenAccountA.toString());
    const tokenAccountB = tokenAccountsMap.get(tsAcc.tokenAccountB.toString());
    if (!tokenAccountA || !tokenAccountB) continue;
    if (tokenAccountA.amount.isZero()) continue;
    if (tokenAccountB.amount.isZero()) continue;

    let shareA = tokenAccountB.amount
      .div(tokenAccountA.amount.plus(tokenAccountB.amount))
      .times(usdcTokenPrice.price)
      .toNumber();
    let shareB = tokenAccountA.amount
      .div(tokenAccountA.amount.plus(tokenAccountB.amount))
      .times(usdcTokenPrice.price)
      .toNumber();

    if (marketAcc.outcome === Outcome.Yes) {
      shareA = 1;
      shareB = 0;
    }
    if (marketAcc.outcome === Outcome.No) {
      shareA = 0;
      shareB = 1;
    }
    if (marketAcc.outcome === Outcome.Invalid) {
      shareA = 0.5;
      shareB = 0.5;
    }

    const liquidityNameA =
      mintA.pubkey.toString() === marketAcc.yesToken.toString()
        ? 'Bet - YES'
        : 'Bet - NO';
    const sourceA: TokenPriceSource = {
      address: mintA.pubkey.toString(),
      decimals: mintA.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      timestamp: Date.now(),
      elementName: 'Hedgehog AMM',
      liquidityName: liquidityNameA,
      weight: 1,
      price: shareA * usdcTokenPrice.price,
      underlyings: [
        {
          address: usdcSolanaMint,
          amountPerLp: shareA,
          decimals: usdcSolanaDecimals,
          networkId: NetworkId.solana,
          price: usdcTokenPrice.price,
        },
      ],
      sourceRefs: [
        { name: 'Pool', address: acc.pubkey.toString() },
        { name: 'Market', address: marketAcc.pubkey.toString() },
      ],
    };

    const liquidityNameB =
      mintB.pubkey.toString() === marketAcc.yesToken.toString()
        ? 'Bet - YES'
        : 'Bet - NO';
    const sourceB: TokenPriceSource = {
      address: mintB.pubkey.toString(),
      decimals: mintB.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      timestamp: Date.now(),
      elementName: 'Hedgehog AMM',
      liquidityName: liquidityNameB,
      weight: 1,
      price: shareB * usdcTokenPrice.price,
      underlyings: [
        {
          address: usdcSolanaMint,
          amountPerLp: shareB,
          decimals: usdcSolanaDecimals,
          networkId: NetworkId.solana,
          price: usdcTokenPrice.price,
        },
      ],
      sourceRefs: [
        { name: 'Pool', address: acc.pubkey.toString() },
        { name: 'Market', address: marketAcc.pubkey.toString() },
      ],
    };
    sources.push(sourceA, sourceB);
  }

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-amm`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
