import {
  TokensInfosGetter,
  getTokensInfosV2,
  getTokensInfosV1,
} from './helpers';

const seaswapId = 'seaswap';
const astroportId = 'astroport';

export const liquidityPoolsKey = 'liquiditypools';
export const liquidityPoolsInfos: LiquidityPoolsInfo[] = [
  {
    platformId: astroportId,
    codes: [3, 149],
    getter: getTokensInfosV1,
  },
  {
    platformId: seaswapId,
    codes: [15],
    namesFilters: ['SeaSwap_Liquidity_Token'],
    getter: getTokensInfosV2,
  },
];

type LiquidityPoolsInfo = {
  platformId: string; // The platform of the LPs
  codes: number[]; // Store all LPs contracts
  namesFilters?: string[]; // Use to filter on LPs name
  getter: TokensInfosGetter; // A function to retrieve tokens breakdown within the LP
};
