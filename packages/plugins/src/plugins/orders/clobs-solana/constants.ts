import { PublicKey } from '@solana/web3.js';
import { openbookPlatform, serumPlatform } from '../../../platforms';
import {
  openOrdersV2Struct,
  serumMarketV1Struct,
  serumMarketV2Struct,
  serumMarketV3Struct,
} from './structs';
import { CLOBProgramInfo } from './types';
import { openOrdersV1Struct } from '../../raydium/structs/openOrders';

export const openBookV1ProgramId = new PublicKey(
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX'
);

export const serumV3ProgramId = new PublicKey(
  '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
);

export const serumV2ProgramId = new PublicKey(
  'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o'
);

export const serumV1ProgramId = new PublicKey(
  '4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn'
);

export const serumMarketsPrefix = `${serumPlatform.id}-markets`;
export const openbookMarketsPrefix = `${openbookPlatform.id}-markets`;

export const markets = {
  serumV1: {
    programId: serumV1ProgramId,
    struct: serumMarketV1Struct,
    orderStruct: openOrdersV1Struct,
    prefix: serumMarketsPrefix,
  } as CLOBProgramInfo,
  serumV2: {
    programId: serumV2ProgramId,
    struct: serumMarketV2Struct,
    orderStruct: openOrdersV1Struct,
    prefix: serumMarketsPrefix,
  } as CLOBProgramInfo,
  serumV3: {
    programId: serumV3ProgramId,
    struct: serumMarketV3Struct,
    orderStruct: openOrdersV2Struct,
    prefix: serumMarketsPrefix,
  } as CLOBProgramInfo,
  openbookV1: {
    programId: openBookV1ProgramId,
    struct: serumMarketV2Struct,
    orderStruct: openOrdersV2Struct,
    prefix: openbookMarketsPrefix,
  } as CLOBProgramInfo,
};
