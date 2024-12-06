import { PublicKey } from '@solana/web3.js';

export type VaultInfo = {
  pubkey: string;
  platformId: string;
  mint: string;
  decimals: number;
  name: string;
  totalShares: string;
  profitShare: number;
  user: PublicKey;
};
