import { openbookPlatform, serumPlatform } from '../../../platforms';
import {
  openOrdersV2Struct,
  serumMarketV1Struct,
  serumMarketV2Struct,
  serumMarketV3Struct,
} from './structs';
import { CLOBProgramInfo } from './types';
import { openOrdersV1Struct } from '../../raydium/structs/openOrders';

export const serumMarketsPrefix = `${serumPlatform.id}-markets`;
export const openbookMarketsPrefix = `${openbookPlatform.id}-markets`;

export const clobVersions = {
  serumV1: {
    programId: '4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn',
    struct: serumMarketV1Struct,
    orderStruct: openOrdersV1Struct,
    prefix: serumMarketsPrefix,
  } as CLOBProgramInfo,
  serumV2: {
    programId: 'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o',
    struct: serumMarketV2Struct,
    orderStruct: openOrdersV1Struct,
    prefix: serumMarketsPrefix,
  } as CLOBProgramInfo,
  serumV3: {
    programId: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    struct: serumMarketV3Struct,
    orderStruct: openOrdersV2Struct,
    prefix: serumMarketsPrefix,
  } as CLOBProgramInfo,
  openbookV1: {
    programId: 'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX',
    struct: serumMarketV2Struct,
    orderStruct: openOrdersV2Struct,
    prefix: openbookMarketsPrefix,
  } as CLOBProgramInfo,
  // openbookV2: {
  //   programId: 'opnbkNkqux64GppQhwbyEVc3axhssFhVYuwar8rDHCu',
  //   struct: openbookMarketV1Struct,
  //   orderStruct: openOrdersV3Struct,
  //   prefix: openbookMarketsPrefix,
  // } as CLOBProgramInfo,
};
