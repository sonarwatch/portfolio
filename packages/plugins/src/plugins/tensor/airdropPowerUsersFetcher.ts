import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { magmaProgramId, platformId, tnsrMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vestingAccountStruct } from './struct';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ownerHasPowerUserAllocation } from './helpers';
import { vestingFilter } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  if (!ownerHasPowerUserAllocation(owner)) return [];

  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    vestingAccountStruct,
    new PublicKey(magmaProgramId),
    vestingFilter(owner),
    1
  );

  if (!accounts.length) return [];

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    accounts[0].pubkey,
    { mint: new PublicKey(tnsrMint) }
  );

  if (!tokenAccounts.value[0]) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Airdrop',
    name: 'Power User',
  });

  element.addAsset({
    address: tokenAccounts.value[0].account.data.parsed.info.mint,
    amount:
      tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount,
    alreadyShifted: true,
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop-power-users`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
