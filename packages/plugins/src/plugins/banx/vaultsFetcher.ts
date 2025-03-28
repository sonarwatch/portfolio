import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  banxSolMint,
  banxVaultsPid,
  platformId,
  vaultsMemo,
} from './constants';
import { banxPoolUserDepositStruct } from './structs';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { usdcSolanaMint } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    banxPoolUserDepositStruct,
    banxVaultsPid
  )
    .addFilter('accountDiscriminator', [111, 224, 169, 186, 223, 215, 84, 49])
    .addFilter('user', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const vaults = await vaultsMemo.getItem(cache);
  if (!vaults) throw new Error('Vaults not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const vault = vaults.get(account.banxPool.toString());
    if (!vault) return;

    const element = elementRegistry.addElementMultiple({
      label: 'Vault',
      name: vault.vaultName,
      ref: account.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: vault.vaultPubkey.toString(),
        },
      ],
      link: `https://banx.gg/lend/vaults/${vault.vaultPubkey}`,
    });

    let mint;
    switch (vault.lendingToken) {
      case 'usdc':
        mint = usdcSolanaMint;
        break;
      case 'banxsol':
        mint = banxSolMint;
        break;
      case 'sol':
      default:
        mint = solanaNativeAddress;
        break;
    }

    element.addAsset({
      address: mint,
      amount: account.depositAmount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
