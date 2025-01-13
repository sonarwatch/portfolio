import { PublicKey } from '@solana/web3.js';

export type House = {
  pubkey: PublicKey;
  houseMint: string;
  currency: string;
  currencyDecimals: number;
  houseTokenSupply: string;
  liquidity: string;
};

export type Position = {
  house: string;
  user: string;
  amount: string;
  status: {
    deposit?: {};
    withdraw?: {};
  };
};

export type Miner = {
  isBoosted: boolean;
  rewarder: string;
  authority: string;
  amount: string;
  rewards: string;
  revshares: number;
};
