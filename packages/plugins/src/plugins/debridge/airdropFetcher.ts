import { isEvmAddress, NetworkId } from '@sonarwatch/portfolio-core';
import { AccountInfo } from '@solana/web3.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  firstDistribStatics,
  dbrMint,
  secondDistribStatics,
  platformId,
  dbrImg,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import distributions from './distributions.json';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { getEvmReceiptPdaBySeason, getSolReceiptPdaBySeason } from './helpers';

const distributionByWallet = distributions as {
  [key: string]: {
    one: number | null;
    two?: number | null;
  };
};

const executorDis1: AirdropFetcherExecutor = async (owner: string) => {
  const isEvm = isEvmAddress(owner);
  const walletDistributions = distributionByWallet[owner];
  const pda = isEvm
    ? getEvmReceiptPdaBySeason(owner, 1)
    : getSolReceiptPdaBySeason(owner, 1);

  const receipt: AccountInfo<Buffer> | null =
    await getClientSolana().getAccountInfo(pda);

  if (!walletDistributions || !walletDistributions.one) {
    return getAirdropRaw({
      statics: firstDistribStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'DBR',
          address: isEvm ? undefined : dbrMint,
          imageUri: isEvm ? dbrImg : undefined,
        },
      ],
    });
  }

  return getAirdropRaw({
    statics: firstDistribStatics,
    items: [
      {
        amount: walletDistributions.one,
        isClaimed: !!receipt,
        label: 'DBR',
        address: isEvm ? undefined : dbrMint,
        imageUri: isEvm ? dbrImg : undefined,
      },
    ],
  });
};

const executorDis2: AirdropFetcherExecutor = async (owner: string) => {
  const isEvm = isEvmAddress(owner);
  const walletDistributions = distributionByWallet[owner];

  const pdas = isEvm
    ? [getEvmReceiptPdaBySeason(owner, 2), getEvmReceiptPdaBySeason(owner, 3)]
    : [getSolReceiptPdaBySeason(owner, 2), getSolReceiptPdaBySeason(owner, 3)];

  const receipts: (AccountInfo<Buffer> | null)[] =
    await getMultipleAccountsInfoSafe(getClientSolana(), pdas);

  const isClaimed = receipts.some((receipt) => !!receipt);

  if (!walletDistributions || !walletDistributions.two) {
    return getAirdropRaw({
      statics: secondDistribStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'DBR',
          address: isEvm ? undefined : dbrMint,
          imageUri: isEvm ? dbrImg : undefined,
        },
      ],
    });
  }

  return getAirdropRaw({
    statics: secondDistribStatics,
    items: [
      {
        amount: walletDistributions.two,
        isClaimed,
        label: 'DBR',
        address: isEvm ? undefined : dbrMint,
        imageUri: isEvm ? dbrImg : undefined,
      },
    ],
  });
};

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
  platformId,
  'dis1-debridge-airdrop',
  firstDistribStatics.claimEnd
);

export const dis2Fetcher = airdropFetcherToFetcher(
  dis2AirdropFetcherSolana,
  platformId,
  'dis2-debridge-airdrop',
  secondDistribStatics.claimEnd
);
