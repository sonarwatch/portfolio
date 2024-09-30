import { PublicKey } from '@solana/web3.js';

export interface LendInfoItem {
  lookupTableAddress: PublicKey;
  programId: PublicKey;
  tokenMint: PublicKey;
  marketInfoAccount: PublicKey;
  marketOwner: PublicKey;
  lendingPoolInfoAccount: PublicKey;
  lendingMarketAuthority: PublicKey;
  lendingPoolTknAccount: PublicKey;
  lendingPoolFeeAccount: PublicKey;
  lendingPoolShareMint: PublicKey;
  lendingPoolShareAccount: PublicKey;
  lendingPoolCreditMint: PublicKey;
  lendingPoolCreditAccount: PublicKey;
}
