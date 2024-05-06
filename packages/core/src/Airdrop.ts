import { AddressSystemType } from './Address';
import { NetworkIdType } from './Network';
import { UsdValue } from './UsdValue';

export enum AirdropClaimStatus {
  notYetOpen = '0_notYetOpen',
  open = '1_open',
  closed = '2_closed',
}

export enum AirdropUserStatus {
  claimable = 'claimable',
  claimableLater = 'claimableLater',
  claimed = 'claimed',
  claimMissed = 'claimMissed',
  nonEligible = 'nonEligible',
}

export function isAirdropEligible(airdrop: Airdrop): boolean {
  return airdrop.amount > 0;
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
  amount: number,
  isClaimed: boolean
): AirdropUserStatus {
  if (amount <= 0) return AirdropUserStatus.nonEligible;

  if (claimStatus === AirdropClaimStatus.notYetOpen)
    return AirdropUserStatus.claimableLater;

  if (isClaimed) return AirdropUserStatus.claimed;

  if (claimStatus === AirdropClaimStatus.closed)
    return AirdropUserStatus.claimMissed;

  return AirdropUserStatus.claimable;
}

export type Airdrop = {
  /**
   * The airdrop id. (e.g. 'jupiter_season1')
   */
  id: string;
  /**
   * The airdrop image.
   */
  image: string;
  /**
   * The airdrop emitter name. (e.g. Jupiter)
   */
  emitterName: string;
  /**
   * The airdrop emitter link.
   */
  emitterLink: string;
  /**
   * A name for the airdrop. Should not container the emitter name. (e.g. 'Season #1')
   */
  name?: string;
  /**
   * A short name for the airdrop. (e.g. 'Jupiter S1')
   */
  shortName: string;

  /**
   * The airdrop claim link.
   */
  claimLink: string;
  /**
   * The airdrop claim start date (as ms).
   */
  claimStart?: number;
  /**
   * The airdrop claim end date (as ms).
   */
  claimEnd?: number;
  /**
   * The airdrop claim status.
   */
  claimStatus: AirdropClaimStatus;

  /**
   * Indicates whether airdrop has already been claimed by the user.
   */
  isClaimed: boolean;
  /**
   * The airdropped item amount.
   * If set to -1 means non eligible.
   */
  amount: number;
  /**
   * The airdropped item label.
   */
  label: string;
  /**
   * The airdropped item price.
   */
  price: UsdValue;
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
