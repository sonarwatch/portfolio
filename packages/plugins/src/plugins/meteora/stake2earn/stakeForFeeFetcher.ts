import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { feeVaultsKey, stakeForFeeProgramId, platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts, ParsedAccount } from '../../../utils/solana';
import { FeeVault, stakeEscrowStruct, unstakeStruct } from './structs';
import { MemoizedCache } from '../../../utils/misc/MemoizedCache';
import { stakeEscrowFilter, unstakeFilter } from '../filters';

const feeVaultsMemo = new MemoizedCache<ParsedAccount<FeeVault>[]>(
  feeVaultsKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const stakeEscrows = await getParsedProgramAccounts(
    client,
    stakeEscrowStruct,
    stakeForFeeProgramId,
    stakeEscrowFilter(owner)
  );

  if (!stakeEscrows) return [];

  const unstakes = await Promise.all(
    stakeEscrows.map((stakeEscrow) =>
      getParsedProgramAccounts(
        client,
        unstakeStruct,
        stakeForFeeProgramId,
        unstakeFilter(stakeEscrow.pubkey.toString())
      )
    )
  );

  const feeVaults = await feeVaultsMemo.getItem(cache);
  if (!feeVaults) throw new Error('Fee vaults not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  stakeEscrows.forEach((stakeEscrow, i) => {
    const feeVault = feeVaults.find(
      (v) => v.pubkey.toString() === stakeEscrow.vault.toString()
    );
    if (!feeVault) return;

    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      ref: stakeEscrow.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: feeVault.pool.toString(),
        },
      ],
      link: `https://app.meteora.ag/pools/${feeVault.pool.toString()}`,
    });

    element.addAsset({
      address: feeVault.stakeMint,
      amount: stakeEscrow.stakeAmount,
    });

    element.addAsset({
      address: feeVault.stakeMint,
      amount: stakeEscrow.feeAPending,
    });

    element.addAsset({
      address: feeVault.quoteMint,
      amount: stakeEscrow.feeBPending,
    });

    if (unstakes[i]) {
      unstakes[i].forEach((unstake) => {
        element.addAsset({
          address: feeVault.stakeMint,
          amount: unstake.unstakeAmount,
          attributes: {
            lockedUntil: unstake.releaseAt.toNumber(),
          },
        });
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-stake-for-fee`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
