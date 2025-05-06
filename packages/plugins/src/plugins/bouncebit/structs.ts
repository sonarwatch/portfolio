import {
  array,
  BeetStruct,
  FixableBeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

export type Vault = {
  accountDiscriminator: number[];
};
export const vaultStruct = new BeetStruct<Vault>(
  [['accountDiscriminator', uniformFixedSizeArray(u8, 8)]],
  (args) => args as Vault,
  'Vault'
);

export type OpenRequest = {
  principal: BigNumber;
  closed_shares: BigNumber;
  pending_until_date_no: number;
  create_date_no: number;
  open_date_no: number;
};

const openRequestStruct = new BeetStruct<OpenRequest>(
  [
    ['principal', u64],
    ['closed_shares', u64],
    ['pending_until_date_no', u16],
    ['create_date_no', u16],
    ['open_date_no', u16],
  ],
  (args) => args as OpenRequest,
  'OpenRequest'
);

export type OpenRequests = {
  accountDiscriminator: number[];
  open_requests: OpenRequest[];
};
export const openRequestsStruct = new FixableBeetStruct<OpenRequests>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['open_requests', array(openRequestStruct)],
  ],
  (args) => args as OpenRequests,
  'OpenRequests'
);
