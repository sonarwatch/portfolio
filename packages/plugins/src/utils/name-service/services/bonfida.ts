import { PublicKey } from '@solana/web3.js';
import { bonfidaNameChecker } from '@sonarwatch/portfolio-core';
import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  deserializeReverse,
  getReverseKeyFromDomainKey,
  resolve,
} from '@bonfida/spl-name-service';
import { getClientSolana } from '../../clients';
import { NameService } from '../types';
import { getParsedAccountInfo } from '../../solana/getParsedAccountInfo';

const NAME_OFFERS_ID = new PublicKey(
  '85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29'
);

type FavouriteDomain = {
  tag: number;
  nameAccount: PublicKey;
};

export const favouriteDomainStruct = new BeetStruct<FavouriteDomain>(
  [
    ['tag', u8],
    ['nameAccount', publicKey],
  ],
  (args) => args as FavouriteDomain
);

async function getOwner(name: string): Promise<string | null> {
  const client = getClientSolana();
  const domainName = name.slice(0, -4).toLowerCase();

  try {
    const owner = await resolve(client, domainName);
    return owner.toBase58();
  } catch (e) {
    return null;
  }
}

export async function getNames(address: string): Promise<string[]> {
  const client = getClientSolana();
  const owner = new PublicKey(address);

  const [favKey] = PublicKey.findProgramAddressSync(
    [Buffer.from('favourite_domain'), owner.toBuffer()],
    NAME_OFFERS_ID
  );
  const favouriteDomain = await getParsedAccountInfo(
    client,
    favouriteDomainStruct,
    favKey
  );

  if (!favouriteDomain) return [];

  const reverseKey = getReverseKeyFromDomainKey(favouriteDomain.nameAccount);

  const nameAccountInfo = await client.getAccountInfo(reverseKey);
  if (nameAccountInfo === null || !nameAccountInfo.data) return [];

  const data = nameAccountInfo.data.subarray(96);

  if (!data) return [];

  const reverse = deserializeReverse(data);
  if (!reverse) return [];
  return [`${reverse}.sol`];
}

export const nameService: NameService = {
  id: 'bonfida',
  checker: bonfidaNameChecker,
  getNames,
  getOwner,
};
