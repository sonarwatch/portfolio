import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, restakingProgramId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwner } from '../../utils/solana/getTokenAccountsByOwner';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { vaultStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = (await getTokenAccountsByOwner(owner)).filter((x) =>
    x.amount.isEqualTo(1)
  );
  if (!potentialTokens.length) return [];

  const positionsProgramAddress = potentialTokens.map(
    (address) =>
      PublicKey.findProgramAddressSync(
        [Buffer.from('vault_params', 'utf-8'), address.mint.toBuffer()],
        restakingProgramId
      )[0]
  );

  if (positionsProgramAddress.length === 0) return [];

  const connection = getClientSolana();

  const vaults = await getParsedMultipleAccountsInfo(
    connection,
    vaultStruct,
    positionsProgramAddress
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });

  vaults.forEach((item, i) => {
    const vault = vaults[i];
    if (vault) {
      element.addAsset({
        address: vault.stakeMint,
        amount: vault.stakeAmount,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
