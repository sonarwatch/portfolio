import { ID } from '../../utils/sui/types/id';

export type Lock = {
  fields: {
    expire_at: string;
    expire_in: string;
    id: ID;
    lock_type: string;
    maker: string;
    maker_price: string;
    marketplace_fee: string;
    nft_id: string;
    premium: string;
    premium_fee: string;
    royalty: string;
    state: string;
    taker: string;
    taker_price: string;
  };
  type: string;
};

export type LockObject = {
  id: ID;
  name: number[];
  value: Lock;
};

export type Bid = {
  beneficiary: string;
  buyer: string;
  commission: string;
  id: ID;
  nft_id: null;
  nft_type: string;
  price: string;
  wallet: Wallet;
};

export type Wallet = {
  fields: Fields;
  type: string;
};

export type Fields = {
  balance: string;
  id: ID;
};
