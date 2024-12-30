import {
  NetworkId,
  TokenPriceSource,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  fragmetricPid,
  fragSOLMint,
  nSOLMint,
  nSOLReserve,
  platformId,
} from './constants';
import { normalizedTokenPoolStruct } from './structs';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const normalizedPools = await getParsedProgramAccounts(
    connection,
    normalizedTokenPoolStruct,
    fragmetricPid,
    [
      {
        dataSize: 1887,
      },
    ]
  );

  const [tokenPriceById, tokenMintsAccounts, nSOLReserveAccount] =
    await Promise.all([
      cache.getTokenPricesAsMap(
        normalizedPools
          .map((pool) => pool.supported_tokens.map((t) => t.mint.toString()))
          .flat(),
        NetworkId.solana
      ),
      getParsedMultipleAccountsInfo(connection, mintAccountStruct, [
        ...normalizedPools.map((pool) => pool.normalized_token_mint),
        fragSOLMint,
      ]),
      getParsedAccountInfo(connection, tokenAccountStruct, nSOLReserve),
    ]);

  const sources: TokenPriceSource[] = [];
  for (const pool of normalizedPools) {
    const address = pool.normalized_token_mint.toString();
    const mintAccount = tokenMintsAccounts.find(
      (acc) => acc?.pubkey === pool.normalized_token_mint
    );

    if (!mintAccount) continue;
    const supply = mintAccount.supply.dividedBy(10 ** mintAccount.decimals);

    let tvl = new BigNumber(0);
    let missingToken = false;
    const underlyings: TokenPriceUnderlying[] = [];
    for (const token of pool.supported_tokens) {
      const tokenPrice = tokenPriceById.get(token.mint.toString());
      if (token.locked_amount.isZero()) continue;

      if (!tokenPrice) {
        missingToken = true;
        continue;
      }

      tvl = tvl.plus(
        token.locked_amount
          .dividedBy(10 ** tokenPrice.decimals)
          .times(tokenPrice.price)
      );
      underlyings.push({
        address: token.mint.toString(),
        amountPerLp: token.locked_amount
          .dividedBy(10 ** tokenPrice.decimals)
          .dividedBy(supply)
          .toNumber(),
        decimals: tokenPrice.decimals,
        networkId: NetworkId.solana,
        price: tokenPrice.price,
      });
    }
    if (missingToken) continue;

    sources.push({
      address,
      decimals: mintAccount.decimals,
      id: pool.pubkey.toString(),
      networkId: NetworkId.solana,
      platformId,
      price: tvl.dividedBy(supply).toNumber(),
      timestamp: Date.now(),
      weight: 1,
      underlyings,
    });
  }

  // Price the fragSOL token which represent the nSOL deposit in jito vault
  const nSOLPrice = sources.find((tP) => tP.address === nSOLMint);
  const fragSOLMintAccount = tokenMintsAccounts.find(
    (acc) => acc?.pubkey.toString() === fragSOLMint.toString()
  );
  if (nSOLPrice && fragSOLMintAccount && nSOLReserveAccount) {
    const nSOLByfragSOL = nSOLReserveAccount.amount
      .dividedBy(10 ** nSOLPrice.decimals)
      .dividedBy(
        fragSOLMintAccount.supply.dividedBy(10 ** fragSOLMintAccount.decimals)
      );
    const fragSOLPrice = nSOLByfragSOL.times(nSOLPrice.price);

    sources.push({
      address: fragSOLMint.toString(),
      decimals: fragSOLMintAccount.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price: fragSOLPrice.toNumber(),
      timestamp: Date.now(),
      weight: 1,
      underlyings: [
        {
          address: nSOLMint,
          amountPerLp: nSOLByfragSOL.toNumber(),
          decimals: nSOLPrice.decimals,
          networkId: NetworkId.solana,
          price: nSOLPrice.price,
        },
      ],
    });
  }
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  label: 'normal',
};
export default job;
