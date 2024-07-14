import { AddressSystemType } from './Address';
import { NetworkIdType } from './Network';
import { UsdValue } from './UsdValue';

export enum AirdropStatus {
  notYetOpen = '0_notYetOpen',
  open = '1_open',
  closed = '2_closed',
}

/**
 * Indicates whether airdrop item has already been claimed by the user.
 * If set to null it means that claim status is unknowned.
 */
export type IsClaimed = boolean | null;

export enum AirdropItemStatus {
  claimable = '0_claimable',
  claimableLater = '1_claimableLater',
  claimableOrClaimed = '2_claimableOrClaimed',
  claimed = '3_claimed',
  claimExpired = '4_claimExpired',
  ineligible = '5_ineligible',
}

export function getIsEligible(amount: number): boolean {
  return amount > 0;
}

export function getAirdropStatus(
  claimStart?: number,
  claimEnd?: number
): AirdropStatus {
  const now = Date.now();
  if (claimStart === undefined) return AirdropStatus.notYetOpen;
  if (claimStart > now) return AirdropStatus.notYetOpen;
  if (claimEnd === undefined) return AirdropStatus.open;
  if (claimEnd > now) return AirdropStatus.open;
  return AirdropStatus.closed;
}

export function getAirdropItemStatus(
  airdropStatus: AirdropStatus,
  amount: number,
  isClaimed: IsClaimed
): AirdropItemStatus {
  if (amount <= 0) return AirdropItemStatus.ineligible;

  if (isClaimed === true) return AirdropItemStatus.claimed;

  if (airdropStatus === AirdropStatus.notYetOpen)
    return AirdropItemStatus.claimableLater;

  if (airdropStatus === AirdropStatus.closed)
    return AirdropItemStatus.claimExpired;

  if (isClaimed === null) return AirdropItemStatus.claimableOrClaimed;

  return AirdropItemStatus.claimable;
}

export type Airdrop = {
  /**
   * The airdrop id. (e.g. 'jupiter_season1')
   */
  id: string;
  /**
   * The airdrop network id. (e.g. 'solana')
   */
  networkId: NetworkIdType;
  /**
   * A name for the airdrop. Should not container the emitter name. (e.g. 'Season #1')
   */
  name?: string;
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
   * The airdrop items.
   */
  items: AirdropItem[];
};

export type AirdropItem = {
  /**
   * Indicates whether the user is eligible to the airdrop.
   */
  isEligible: boolean;
  /**
   * Indicates whether airdrop item has already been claimed by the user.
   * If set to null it means that claim status is unknowned.
   */
  isClaimed: IsClaimed;
  /**
   * The airdropped item address.
   */
  address?: string;
  /**
   * The airdropped item amount.
   * If set to 0 it means ineligible.
   */
  amount: number;
  /**
   * The airdropped item label.
   */
  label: string;
  /**
   * The airdropped item image uri.
   */
  imageUri?: string;
};

export type AirdropEnhanced = Omit<Airdrop, 'items'> & {
  /**
   * The airdrop status.
   */
  status: AirdropStatus;
  /**
   * The airdrop items.
   */
  items: AirdropItemEnhanced[];
};

export type AirdropItemEnhanced = AirdropItem & {
  /**
   * The airdropped item price.
   */
  price: UsdValue;
  /**
   * Indicates whether airdrop item has already been claimed by the user.
   */
  status: AirdropItemStatus;
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
  airdrop: AirdropEnhanced;
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
  airdrops: AirdropEnhanced[];
};
