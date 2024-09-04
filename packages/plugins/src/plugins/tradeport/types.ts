type ID = {
  id: string;
};

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
