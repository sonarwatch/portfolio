import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { pid, platformId, assetsConfigs } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { claimDataStruct, userDataStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';

function getUserDataPdas(owner: string): PublicKey[] {
  return assetsConfigs.map(
    (config) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('vault-user', 'utf-8'),
          new PublicKey(config.vault).toBuffer(),
          new PublicKey(owner).toBuffer(),
        ],
        pid
      )[0]
  );
}
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const [userDatas, claimAccounts] = await Promise.all([
    getParsedMultipleAccountsInfo(
      connection,
      userDataStruct,
      getUserDataPdas(owner)
    ),
    ParsedGpa.build(connection, claimDataStruct, pid)
      .addFilter('discriminator', [156, 12, 197, 103, 61, 191, 99, 234])
      .addFilter('authority', new PublicKey(owner))
      .addDataSizeFilter(105)
      .run(),
  ]);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    link: 'https://app.cytonic.com/deposit',
  });
  userDatas.forEach((userData, index) => {
    if (!userData) return;
    const config = assetsConfigs[index];
    element.addAsset({
      address: config.mint,
      amount: userData.depositAmount,
      ref: userData.pubkey.toString(),
      sourceRefs: [{ address: config.vault, name: 'Vault' }],
    });
  });

  claimAccounts.forEach((claim) => {
    if (!claim) return;
    const config = assetsConfigs.find(
      (asset) => asset.vault === claim.vaultData.toString()
    );
    if (!config) return;
    element.addAsset({
      address: config.mint,
      amount: claim.amount,
      attributes: {
        lockedUntil: claim.claimableAfter.times(1000).toNumber(),
        tags: ['Withdraw'],
      },
      ref: claim.pubkey.toString(),
      sourceRefs: [{ address: config.vault, name: 'Vault' }],
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
