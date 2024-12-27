import { isEvmAddress, NetworkId } from '@sonarwatch/portfolio-core';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  firstDistribStatics,
  dbrMint,
  platform as dbrPlatform,
  platform,
  distributorPid,
  receiptBuffer,
  secondDistribStatics,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import distributions from './renamed.json';

const distributionByWallet = distributions as {
  [key: string]: {
    disOne: string | null;
    disTwo: string | null;
  };
};

const executorDis1: AirdropFetcherExecutor = async (owner: string) => {
  const isEvm = isEvmAddress(owner);
  const walletDistributions = distributionByWallet[owner];
  const pda = isEvm ? getEvmPda(owner, 1) : getSolPda(owner, 1);

  const receipt: AccountInfo<Buffer> | null =
    await getClientSolana().getAccountInfo(pda);

  if (!walletDistributions || !walletDistributions.disOne) {
    return getAirdropRaw({
      statics: firstDistribStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'DBR',
          address: isEvm ? undefined : dbrMint,
          imageUri: isEvm ? dbrPlatform.image : undefined,
        },
      ],
    });
  }

  return getAirdropRaw({
    statics: firstDistribStatics,
    items: [
      {
        amount: Number(walletDistributions.disOne),
        isClaimed: !!receipt,
        label: 'DBR',
        address: isEvm ? undefined : dbrMint,
        imageUri: isEvm ? dbrPlatform.image : undefined,
      },
    ],
  });
};

const executorDis2: AirdropFetcherExecutor = async (owner: string) => {
  const isEvm = isEvmAddress(owner);
  const walletDistributions = distributionByWallet[owner];

  if (!walletDistributions || !walletDistributions.disTwo) {
    return getAirdropRaw({
      statics: secondDistribStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'DBR',
          address: isEvm ? undefined : dbrMint,
          imageUri: isEvm ? dbrPlatform.image : undefined,
        },
      ],
    });
  }

  return getAirdropRaw({
    statics: secondDistribStatics,
    items: [
      {
        amount: Number(walletDistributions.disTwo),
        isClaimed: false,
        label: 'DBR',
        address: isEvm ? undefined : dbrMint,
        imageUri: isEvm ? dbrPlatform.image : undefined,
      },
    ],
  });
};

function getEvmPda(owner: string, season: number): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      receiptBuffer,
      Uint8Array.from([season]),
      Buffer.from(owner.slice(2), 'hex'),
    ],
    distributorPid
  )[0];
}

function getSolPda(owner: string, season: number): PublicKey {
  return PublicKey.findProgramAddressSync(
    [receiptBuffer, Uint8Array.from([season]), new PublicKey(owner).toBytes()],
    distributorPid
  )[0];
}

export const dis1AirdropFetcherEvm: AirdropFetcher = {
  id: `${firstDistribStatics.id}-evm`,
  networkId: NetworkId.ethereum,
  executor: executorDis1,
};

export const dis1AirdropFetcherSolana: AirdropFetcher = {
  id: `${firstDistribStatics.id}-solana`,
  networkId: NetworkId.solana,
  executor: executorDis1,
};

export const dis2AirdropFetcherEvm: AirdropFetcher = {
  id: `${secondDistribStatics.id}-evm`,
  networkId: NetworkId.ethereum,
  executor: executorDis2,
};

export const dis2AirdropFetcherSolana: AirdropFetcher = {
  id: `${secondDistribStatics.id}-solana`,
  networkId: NetworkId.solana,
  executor: executorDis2,
};

export const dis1Fetcher = airdropFetcherToFetcher(
  dis1AirdropFetcherSolana,
  platform.id,
  'dis1-debridge-airdrop',
  firstDistribStatics.claimEnd
);

export const dis2Fetcher = airdropFetcherToFetcher(
  dis2AirdropFetcherSolana,
  platform.id,
  'dis2-debridge-airdrop',
  secondDistribStatics.claimEnd
);
