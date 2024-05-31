import {
  NetworkId,
  TokenPriceSource,
  UniTokenInfo,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { vaultPid, platformId } from './constants';
import { conditionnalVaultStruct } from './structs';
import { tokenListsDetailsPrefix } from '../tokens/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const vaults = await getParsedProgramAccounts(
    client,
    conditionnalVaultStruct,
    vaultPid,
    dataSizeFilter(171)
  );

  const mints: Set<string> = new Set();
  const tokenAccountsPkeys: PublicKey[] = [];
  const passAndFailMints: PublicKey[] = [];
  vaults.forEach((vault) => {
    mints.add(vault.underlyingTokenMint.toString());
    tokenAccountsPkeys.push(vault.underlyingTokenAccount);
    passAndFailMints.push(
      ...[
        vault.conditionalOnFinalizeTokenMint,
        vault.conditionalOnRevertTokenMint,
      ]
    );
  });

  const [tokenPriceById, tokenAccounts, passAndFailsMintAccounts, tokenList] =
    await Promise.all([
      cache.getTokenPricesAsMap(Array.from(mints), NetworkId.solana),
      getParsedMultipleAccountsInfo(
        client,
        tokenAccountStruct,
        tokenAccountsPkeys
      ),
      getParsedMultipleAccountsInfo(
        client,
        mintAccountStruct,
        passAndFailMints
      ),
      cache.getItems<UniTokenInfo>(Array.from(mints), {
        prefix: tokenListsDetailsPrefix,
        networkId: NetworkId.solana,
      }),
    ]);
  const tokenAccountById: Map<string, TokenAccount> = new Map();
  const passAndFailMintsAccountById: Map<string, MintAccount> = new Map();
  tokenAccounts.forEach((account) => {
    if (account) tokenAccountById.set(account.pubkey.toString(), account);
  });
  passAndFailsMintAccounts.forEach((account) => {
    if (account)
      passAndFailMintsAccountById.set(account.pubkey.toString(), account);
  });

  const tokensDetailsById: Map<string, UniTokenInfo> = new Map();
  tokenList.forEach((tD) =>
    tD ? tokensDetailsById.set(tD.address, tD) : undefined
  );

  const tokenPriceSources: TokenPriceSource[] = [];
  for (const vault of vaults) {
    const tokenPrice = tokenPriceById.get(vault.underlyingTokenMint.toString());
    if (!tokenPrice) continue;

    const underlyingAccount = tokenAccountById.get(
      vault.underlyingTokenAccount.toString()
    );
    if (!underlyingAccount || underlyingAccount.amount.isZero()) continue;

    const passMint = vault.conditionalOnFinalizeTokenMint.toString();
    const failMint = vault.conditionalOnRevertTokenMint.toString();
    const underlyingValue = underlyingAccount.amount
      .times(tokenPrice.price)
      .dividedBy(10 ** vault.decimals);

    const [passMintAccount, failMintAccount] = [
      passAndFailMintsAccountById.get(passMint),
      passAndFailMintsAccountById.get(failMint),
    ];
    if (!passMintAccount || !failMintAccount) continue;

    const passPrice = underlyingValue.dividedBy(
      passMintAccount.supply.dividedBy(10 ** passMintAccount.decimals)
    );
    const failPrice = underlyingValue.dividedBy(
      failMintAccount.supply.dividedBy(10 ** failMintAccount.decimals)
    );

    const underlyingTokenDetail = tokensDetailsById.get(
      vault.underlyingTokenMint.toString()
    );

    tokenPriceSources.push(
      ...[
        {
          address: passMint,
          decimals: passMintAccount.decimals,
          id: vault.pubkey.toString(),
          networkId: NetworkId.solana,
          platformId,
          price: passPrice.toNumber(),
          timestamp: Date.now(),
          weight: 1,
          liquidityName: underlyingTokenDetail
            ? `p${underlyingTokenDetail.symbol}`
            : undefined,
        },
        {
          address: failMint,
          decimals: failMintAccount.decimals,
          id: vault.pubkey.toString(),
          networkId: NetworkId.solana,
          platformId,
          price: failPrice.toNumber(),
          timestamp: Date.now(),
          weight: 1,
          liquidityName: underlyingTokenDetail
            ? `f${underlyingTokenDetail.symbol}`
            : undefined,
        },
      ]
    );
  }

  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
