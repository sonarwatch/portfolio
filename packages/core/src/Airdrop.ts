import { AddressSystemType } from './Address';
import { NetworkIdType } from './Network';
import { UsdValue } from './UsdValue';
import { TokenInfo } from './TokenList';

export enum AirdropStatus {
  notYetOpen = '0_notYetOpen',
  unknowned = '1_unknowned',
  open = '2_open',
  closed = '3_closed',
}

/**
 * Indicates whether airdrop item has already been claimed by the user.
 * If set to null it means that claim status is unknowned.
 */
export type IsClaimed = boolean | null;

export enum AirdropItemStatus {
  claimable = '0_claimable',
  claimableLater = '1_claimableLater',
  potentiallyClaimable = '2_potentiallyClaimable',
  claimed = '3_claimed',
  claimExpired = '4_claimExpired',
  ineligible = '5_ineligible',
}

export function isEligibleAmount(amount: number): boolean {
  return amount > 0;
}

export function getAirdropStatus(
  claimStart?: number,
  claimEnd?: number
): AirdropStatus {
  const now = Date.now();
  if (claimStart && claimStart > now) return AirdropStatus.notYetOpen;
  if (claimEnd && claimEnd < now) return AirdropStatus.closed;
  if (!claimStart && !claimEnd) return AirdropStatus.unknowned;
  if (claimStart && claimStart < now) return AirdropStatus.open;
  return AirdropStatus.unknowned;
}

export function getAirdropItemStatus(
  airdropStatus: AirdropStatus,
  amount: number,
  isClaimed: IsClaimed
): AirdropItemStatus {
  if (!isEligibleAmount(amount)) return AirdropItemStatus.ineligible;

  if (isClaimed === true) return AirdropItemStatus.claimed;

  if (airdropStatus === AirdropStatus.notYetOpen)
    return AirdropItemStatus.claimableLater;

  if (airdropStatus === AirdropStatus.unknowned)
    return AirdropItemStatus.potentiallyClaimable;

  if (isClaimed === null) return AirdropItemStatus.potentiallyClaimable;

  // From here, isClaimed === false

  if (airdropStatus === AirdropStatus.closed)
    return AirdropItemStatus.claimExpired;

  return AirdropItemStatus.claimable;
}

export type AirdropRaw = {
  /**
   * The airdrop id. (e.g. 'jupiter_season1')
   */
  id: string;
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
  claimLink?: string;
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
  items: AirdropItemRaw[];
};

export type AirdropItemRaw = {
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

export type Airdrop = Omit<AirdropRaw, 'items'> & {
  /**
   * The airdrop network id. (e.g. 'solana')
   */
  networkId: NetworkIdType;
  /**
   * The airdrop status.
   */
  status: AirdropStatus;
  /**
   * The airdrop owner.
   */
  owner: string;
  /**
   * The airdrop status.
   */
  value: UsdValue;
  /**
   * The airdrop items.
   */
  items: AirdropItem[];
};

export type AirdropItem = AirdropItemRaw & {
  /**
   * The airdrop item owner.
   */
  owner: string;
  /**
   * The airdrop id associated to the item.
   */
  airdropId: string;
  /**
   * The airdropped item price.
   */
  price: UsdValue;
  /**
   * Indicates whether airdrop item has already been claimed by the user.
   */
  status: AirdropItemStatus;
  /**
   * The airdrop status.
   */
  value: UsdValue;
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
  duration: number;
  tokenInfo?: Partial<Record<NetworkIdType, Record<string, TokenInfo>>>;
};
