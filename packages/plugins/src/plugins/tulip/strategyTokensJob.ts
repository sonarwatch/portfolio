import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
} from '../../utils/solana';
import { platformId, tulipV2ProgramId, vaultsKey } from './constants';
import { multiDepositOptimizerV1Struct } from './structs';
import getLpTokenSourceOld from '../../utils/misc/getLpTokenSourceOld';
import { strategyVaultsFilters } from './filters';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const strategyVaults = await getParsedProgramAccounts(
    client,
    multiDepositOptimizerV1Struct,
    tulipV2ProgramId,
    strategyVaultsFilters
  );

  const promises = [];
  promises.push(
    cache.setItem(vaultsKey, strategyVaults, {
      prefix: platformId,
      networkId: NetworkId.solana,
    })
  );

  const mints: Set<string> = new Set();
  const collatMint: PublicKey[] = [];
  strategyVaults.forEach((sV) => {
    if (
      sV.base.underlyingMint.toString() !== '11111111111111111111111111111111'
    ) {
      mints.add(sV.base.underlyingMint.toString());
    }
    if (sV.base.sharesMint.toString() !== '11111111111111111111111111111111') {
      collatMint.push(sV.base.sharesMint);
    }
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const mintAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    collatMint
  );
  const mintAccountById: Map<string, MintAccount> = new Map();
  mintAccounts.forEach((mA) =>
    mA ? mintAccountById.set(mA.pubkey.toString(), mA) : undefined
  );

  for (let i = 0; i < strategyVaults.length; i += 1) {
    const strategyVault = strategyVaults[i];

    const mint = strategyVault.base.underlyingMint.toString();
    const lpMint = strategyVault.base.sharesMint.toString();
    const tokenPrice = tokenPriceById.get(mint);
    if (!tokenPrice) continue;

    const stakedAmount = strategyVault.base.totalDepositedBalance.dividedBy(
      10 ** tokenPrice.decimals
    );

    const mintAccount = mintAccountById.get(lpMint);
    if (!mintAccount) continue;

    const { supply, decimals } = mintAccount;
    if (supply.isZero()) continue;

    const lpTokenSource = getLpTokenSourceOld(
      NetworkId.solana,
      lpMint,
      platformId,
      {
        address: lpMint.toString(),
        decimals,
        supply: supply.dividedBy(10 ** decimals).toNumber(),
      },
      [
        {
          ...tokenPrice,
          reserveAmount: stakedAmount.toNumber(),
        },
      ]
    );
    promises.push(cache.setTokenPriceSource(lpTokenSource));
  }

  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-strategy-tokens`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
