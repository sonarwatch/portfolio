import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, solayersUSDCPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts, usdcSolanaMint } from '../../utils/solana';
import { proofStruct, sUSDPoolStruct } from './structs';
import { dataSizeFilter } from '../../utils/solana/filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    proofStruct,
    solayersUSDCPid,
    [
      ...dataSizeFilter(621),
      {
        memcmp: {
          bytes: owner,
          offset: 17,
        },
      },
    ]
  );
  if (!accounts) return [];

  const poolAccount = await getParsedProgramAccounts(
    client,
    sUSDPoolStruct,
    solayersUSDCPid,
    [...dataSizeFilter(379)]
  );
  const pool = poolAccount.at(0);

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Deposit',
    name: 'sUSD Restaking',
    link: 'https://app.solayer.org/',
  });
  accounts.forEach((account) => {
    const isDeposit = account.mint.toString() === usdcSolanaMint;
    if (!pool) return;

    // If batchId of the pool is greater than batchId from account and it's a deposit
    // It means the deposits have all been processed and user receive it's sUSD in the wallet
    if (isDeposit && pool.currentDepositId.isGreaterThan(account.batchId))
      return;

    // If batchId of the pool is greater than batchId from account and it's a withdraw
    // It means the user can claim it's USDC
    const isClaimable = !!(
      !isDeposit && pool.currentWithdrawId.isGreaterThan(account.batchId)
    );

    element.addAsset({
      address: account.mint.toString(),
      amount: account.amount,
      attributes: {
        isClaimable,
        tags: [isDeposit ? 'Deposit' : 'Withdraw'],
      },
      ref: account.pubkey,
      sourceRefs: [{ name: 'Pool', address: pool.pubkey.toString() }],
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-proofs`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
