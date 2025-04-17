import BigNumber from 'bignumber.js';
import {
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import {
  marketsInfoKey,
  platformId,
  programId,
  tokenWrappers,
} from './constants';
import { marketStruct } from './structs';
import { marketAccountFilters } from './filters';
import { MarketInfo } from './types';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const markets = await getParsedProgramAccounts(
    client,
    marketStruct,
    programId,
    marketAccountFilters
  );

  const mints = markets
    .map((market) => [
      market.tokenLpMintAddress,
      market.tokenPtMintAddress,
      market.tokenYtMintAddress,
      market.tokenLpMintAddress,
    ])
    .flat();

  const baseMints = markets.map((market) =>
    market.tokenSyMintAddress.toString()
  );
  baseMints.push(...Object.values(tokenWrappers));
  const baseTokenPriceById = await cache.getTokenPricesAsMap(
    baseMints,
    NetworkId.solana
  );

  const mintsAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    mints
  );
  const mintsInfoById: Map<string, MintAccount> = new Map();
  mintsAccounts.forEach((mintAccount) => {
    if (mintAccount)
      mintsInfoById.set(mintAccount?.pubkey.toString(), mintAccount);
  });

  const sources: TokenPriceSource[] = [];
  const marketsInfos: MarketInfo[] = [];
  for (const market of markets) {
    let baseTokenPrice = baseTokenPriceById.get(
      market.tokenSyMintAddress.toString()
    );
    if (
      !baseTokenPrice &&
      tokenWrappers[market.tokenSyMintAddress.toString()]
    ) {
      baseTokenPrice = baseTokenPriceById.get(
        tokenWrappers[market.tokenSyMintAddress.toString()]
      );
    }
    if (!baseTokenPrice) continue;
    const ptPrice = market.marketConfig.startPrice.dividedBy(
      market.marketConfig.marketEndPrice
    );
    const ytPrice = new BigNumber(1).minus(ptPrice);

    const ptMint = market.tokenPtMintAddress;
    const ytMint = market.tokenYtMintAddress;
    const lpMint = market.tokenLpMintAddress;

    const ptDecimals = mintsInfoById.get(ptMint.toString())?.decimals;
    const ytDecimals = mintsInfoById.get(ytMint.toString())?.decimals;
    const lpDecimals = mintsInfoById.get(lpMint.toString())?.decimals;

    if (ptDecimals)
      sources.push({
        address: ptMint.toString(),
        decimals: ptDecimals,
        id: market.pubkey.toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: ptPrice.times(baseTokenPrice.price).toNumber(),
        timestamp: Date.now(),
        weight: 1,
      });

    if (ytDecimals)
      sources.push({
        address: ytMint.toString(),
        decimals: ytDecimals,
        id: market.pubkey.toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: ytPrice.times(baseTokenPrice.price).toNumber(),
        timestamp: Date.now(),
        weight: 1,
      });

    const lpSupply = (await client.getTokenSupply(lpMint)).value.uiAmount;
    const lpUnderlyingTokenAccount = await getParsedAccountInfo(
      client,
      tokenAccountStruct,
      market.vaultLpTokenAccount
    );
    if (lpSupply && lpUnderlyingTokenAccount && lpDecimals) {
      const lpPrice = lpUnderlyingTokenAccount.amount
        .dividedBy(10 ** baseTokenPrice.decimals)
        .times(baseTokenPrice.price)
        .dividedBy(lpSupply);
      sources.push({
        address: lpMint.toString(),
        decimals: lpDecimals,
        id: market.pubkey.toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: lpPrice.toNumber(),
        timestamp: Date.now(),
        weight: 1,
      });
    }

    marketsInfos.push({
      pubkey: market.pubkey.toString(),
      ytMint: market.tokenYtMintAddress.toString(),
      lpMint: market.tokenLpMintAddress.toString(),
      ptMint: market.tokenPtMintAddress.toString(),
      syMint: market.tokenSyMintAddress.toString(),
    });
  }

  await cache.setItem(marketsInfoKey, marketsInfos, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
