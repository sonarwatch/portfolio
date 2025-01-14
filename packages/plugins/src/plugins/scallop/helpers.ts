import { PoolAddressData, SCoinPoolAddress, SpoolAddress } from './types';

export const formatDecimal = (amount: number, decimals: number) =>
  amount / 10 ** decimals;

export const shortenAddress = (address: string, start = 4, end = 4) =>
  `${address.slice(0, start)}..${address.slice(-end)}`;

export const hasSCoinPredicate = (
  address: PoolAddressData
): address is typeof address & Required<SCoinPoolAddress> =>
  !!address.sCoinName &&
  !!address.sCoinType &&
  !!address.sCoinMetadataId &&
  !!address.sCoinSymbol &&
  !!address.sCoinTreasury;

export const hasSpoolPredicate = (
  address: PoolAddressData
): address is typeof address & Required<SpoolAddress> =>
  !!address.spool && !!address.spoolName && !!address.spoolReward;
