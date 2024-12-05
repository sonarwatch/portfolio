import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { feeVaultsKey, stakeForFeeProgramId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { FeeVault, stakeEscrowStruct } from './struct';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { stakeEscrowFilter } from './filters';

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

  const feeVaults = await feeVaultsMemo.getItem(cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });

  stakeEscrows.forEach((stakeEscrow) => {
    const feeVault = feeVaults.find(
      (v) => v.pubkey.toString() === stakeEscrow.vault.toString()
    );
    if (!feeVault) return;

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
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-stake-for-fee`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
