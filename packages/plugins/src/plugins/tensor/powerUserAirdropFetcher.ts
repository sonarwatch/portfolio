import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import {
  magmaProgramId,
  platformId,
  powerUsersStatics,
  tnsrMint,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vestingAccountStruct } from './struct';
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

  return getAirdropRaw({
    statics: powerUsersStatics,
    items: [
      {
        amount:
          tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount,
        isClaimed: false,
        label: 'TNSR',
        address: tnsrMint,
      },
      {
        amount:
          alloc -
          tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount,
        isClaimed: true,
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
  platformId,
  'tensor-s4',
  powerUsersStatics.claimEnd
);
