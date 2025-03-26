import { coinInfo } from '../../utils/aptos';

export const platformId = 'liquidswap';
export const programAddress =
  '0x5a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948';

export const resourceAddress =
  '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12';
export const lpTypePrefix = `${programAddress}::lp_coin::LP<`;

export const lpCoinInfoTypePrefix = `${coinInfo}<${lpTypePrefix}`;
