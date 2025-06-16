import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
  TokenAccount,
} from '../../utils/solana';
import { stakeRegistryId } from './constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';
import { positionDataStruct } from './structs';
import { heliumPlatformId } from '../daos/constants';
import { getLockedUntil } from '../daos/helpers';

export const getHeliumPositions = async (
  potentialTokens: ParsedAccount<TokenAccount>[],
  cache: Cache
) => {
  if (!potentialTokens.length) return [];

  const positionsProgramAddress = potentialTokens.map(
    (address) =>
      PublicKey.findProgramAddressSync(
        [Buffer.from('position'), address.mint.toBuffer()],
        stakeRegistryId
      )[0]
  );

  const client = getClientSolana();

  const accounts = await getParsedMultipleAccountsInfo(
    client,
    positionDataStruct,
    positionsProgramAddress
  );

  if (!accounts.length) return [];

  const elementRegistry = new ElementRegistry(
    NetworkId.solana,
    heliumPlatformId
  );

  accounts.forEach((account) => {
    if (!account) return;

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      ref: account.pubkey,
      link: `https://heliumvote.com/hnt/positions/${account.pubkey}`,
      sourceRefs: [{ name: 'Vault', address: account.registrar.toString() }],
    });

    const lockedUntil = getLockedUntil(
      account.lockup.startTs,
      account.lockup.endTs,
      account.lockup.kind
    );

    element.addAsset({
      address: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux',
      amount: account.amountDepositedNative,
      attributes: {
        lockedUntil,
      },
    });
  });

  return elementRegistry.getElements(cache);
};
