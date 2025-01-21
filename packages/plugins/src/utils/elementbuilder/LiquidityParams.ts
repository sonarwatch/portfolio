import { PublicKey } from '@solana/web3.js';

export type LiquidityParams = {
  name?: string;
  pool?: string | PublicKey;
  id?: string | PublicKey;
};
