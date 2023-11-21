import { coinInfo } from '../../../utils/aptos';

export const programAddress =
  '0x31a6675cbe84365bf2b0cbce617ece6c47023ef70826533bde5203d32171dc3c';
export const lpTypePrefix = `${programAddress}::swap::LPToken<`;
export const lpCoinInfoTypePrefix = `${coinInfo}<${lpTypePrefix}`;
