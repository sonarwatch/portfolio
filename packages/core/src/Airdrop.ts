import { AddressSystemType } from './Address';
import { NetworkIdType } from './Network';
import { UsdValue } from './UsdValue';

export enum AirdropClaimStatus {
  notYetOpen = 'notYetOpen',
  open = 'open',
  closed = 'closed',
}

export enum AirdropUserStatus {
  claimable = 'claimable',
  claimableLater = 'claimableLater',
  claimed = 'claimed',
  claimMissed = 'claimMissed',
  nonEligible = 'nonEligible',
}

export function getAirdropClaimStatus(
  claimStart?: number,
  claimEnd?: number
): AirdropClaimStatus {
  const now = Date.now();
  if (claimStart === undefined) return AirdropClaimStatus.notYetOpen;
  if (claimStart > now) return AirdropClaimStatus.notYetOpen;
  if (claimEnd === undefined) return AirdropClaimStatus.open;
  if (claimEnd > now) return AirdropClaimStatus.open;
  return AirdropClaimStatus.closed;
}

export function getAirdropUserStatus(
  claimStatus: AirdropClaimStatus,
  amount?: number,
  isClaimed?: boolean
): AirdropUserStatus {
  if (amount === undefined || amount === 0)
    return AirdropUserStatus.nonEligible;

  if (claimStatus === AirdropClaimStatus.notYetOpen)
    return AirdropUserStatus.claimableLater;

  if (isClaimed) return AirdropUserStatus.claimed;

  if (claimStatus === AirdropClaimStatus.closed)
    return AirdropUserStatus.claimMissed;

  return AirdropUserStatus.claimable;
}

export function getAirdropStatus(
  claimStart?: number,
  claimEnd?: number,
  amount?: number,
  isClaimed?: boolean
): {
  userStatus: AirdropUserStatus;
  claimStatus: AirdropClaimStatus;
} {
  const claimStatus = getAirdropClaimStatus(claimStart, claimEnd);
  return {
    claimStatus,
    userStatus: getAirdropUserStatus(claimStatus, amount, isClaimed),
  };
}

export type Airdrop = {
  id: string; // e.g. 'tensor_season1',
  claimStatus: AirdropClaimStatus;
  claimLink: string; // e.g. 'https://www.tensor.trade/claim'
  claimStart?: number; // as ms
  claimEnd?: number; // as ms
  image: string;
  organizerLink: string; // e.g. 'https://www.tensor.trade/'
  organizerName: string; // e.g. 'Tensor'
  name?: string; // e.g. 'Season 1'
  label: string; // e.g. 'TSR'
  price: UsdValue;
  userStatus: AirdropUserStatus;
  amount?: number;
};

/**
 * Represents the result of a fetcher.
 */
export type AirdropFetcherResult = {
  date: number;
  owner: string;
  networdkId: NetworkIdType;
  fetcherId: string;
  duration: number;
  airdrop: Airdrop;
};

/**
 * Represents the report of a fetcher.
 */
export type AirdropFetcherReport = {
  id: string;
  status: 'succeeded' | 'failed';
  duration?: number;
  error?: string;
};

/**
 * Represents the result of multiple fetchers.
 */
export type AirdropFetchersResult = {
  date: number;
  owner: string;
  addressSystem: AddressSystemType;
  fetcherReports: AirdropFetcherReport[];
  airdrops: Airdrop[];
};
