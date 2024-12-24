import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import {
  magmaProgramId,
  platform,
  platformId,
  powerUsersStatics,
  tnsrMint,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vestingAccountStruct } from './struct';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { vestingFilter } from './filters';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import powerUsers from './powerUsers.json';

const powerUserAllocations: { [key: string]: number } = powerUsers;

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const alloc = powerUserAllocations[owner];

  if (!alloc)
    return getAirdropRaw({
      statics: powerUsersStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'TNSR',
          address: tnsrMint,
        },
      ],
    });

  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    vestingAccountStruct,
    new PublicKey(magmaProgramId),
    vestingFilter(owner),
    1
  );

  if (!accounts.length)
    return getAirdropRaw({
      statics: powerUsersStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'TNSR',
          address: tnsrMint,
        },
      ],
    });

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    accounts[0].pubkey,
    { mint: new PublicKey(tnsrMint) }
  );

  if (!tokenAccounts.value[0])
    return getAirdropRaw({
      statics: powerUsersStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'TNSR',
          address: tnsrMint,
        },
      ],
    });

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

  const isClaimedFully =
    alloc ===
    tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;

  return getAirdropRaw({
    statics: powerUsersStatics,
    items: [
      {
        amount: alloc,
        isClaimed: isClaimedFully,
        label: 'TNSR',
        address: tnsrMint,
      },
    ],
  });
};

export const powerUserAirdropFetcher: AirdropFetcher = {
  id: powerUsersStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const powerUserFetcher = airdropFetcherToFetcher(
  powerUserAirdropFetcher,
  platform.id,
  'tensor-s4',
  powerUsersStatics.claimEnd
);
