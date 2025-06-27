import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
  TokenAccountWithMetadata,
} from '../../utils/solana';
import { nftIdentifier, platformId, restakingProgramId } from './constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';
import { vaultStruct } from './structs';

export const getPicassoPositions = async (
  tokenAccounts: ParsedAccount<TokenAccountWithMetadata>[],
  cache: Cache
) => {
  const potentialTokens = tokenAccounts.filter(
    (x) => x.amount.isEqualTo(1) && x.metadata?.name === nftIdentifier
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
    link: 'https://app.picasso.network/restake',
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
