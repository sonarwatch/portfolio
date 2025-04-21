import { PublicKey } from '@solana/web3.js';
import { platformId as nxFinancePlatformId } from '../nxfinance/constants';
import { VectisInsuranceIDL } from './vectis_insurance_drift_vaults';

export const circuitPlatformId = 'circuit';
export const moosePlatformId = 'moose';
export const neutralPlatformId = 'neutral';
export const gauntletPlatformId = 'gauntlet';
export const vectisPlatformId = 'vectis';
export const hedgyPlatformId = 'hedgy';
export const m1CapitalPlatformId = 'm1capital';
export const knightradePlatformId = 'knightrade';
export const luckyperpPlatformId = 'luckyperp';

export const vaultsProgramIds = [
  new PublicKey('vAuLTsyrvSfZRuRB3XgvkPwNGgYSs9YRYymVebLKoxR'), // from Drift
  new PublicKey('9Fcn3Fd4d5ocrb12xCUtEvezxcjFEAyHBPfrZDiPt9Qj'), // from Neutral
  new PublicKey('EuSLjg23BrtwYAk1t4TFe5ArYSXCVXLBqrHRBfWQiTeJ'), // from Neutral
  new PublicKey('BVddkVtFJLCihbVrtLo8e3iEd9NftuLunaznAxFFW8vf'), // from Neutral
  new PublicKey('HYHnL9BB3tqSPxkVbdcAn9CAa4hyqNYUh1FwDc4he7aD'), // from NXFinance
  new PublicKey('EDnxACbdY1GeXnadh5gRuCJnivP7oQSAHGGAHCma4VzG'), // from Vectis
];

// when we need to pass a specific IDL for a vault
export const vaultIdls = {
  EDnxACbdY1GeXnadh5gRuCJnivP7oQSAHGGAHCma4VzG: VectisInsuranceIDL,
};

export const prefixVaults = 'circuitVaults';

// For each vault, find the Manager of the vault and put the pubkey here along with it's platform.
export const platformIdByVaultManager: Map<string, string> = new Map([
  ['GT3RSBy5nS2ACpT3LCkycHWm9CVJCSuqErAgf4sE33Qu', circuitPlatformId],
  ['En8nqJqCE9D2Bsqetw4p89VgZTh8QK8SfCAn5sSyL4PM', moosePlatformId],
  ['C77bxLHWjnAVeG9HdMxu1gunFnjRCcWUDZYfa7xbacHr', neutralPlatformId],
  ['neutBqYtHqPiu89Yfuk3X3cebgBtyppzSbxJ9tt1eSB', neutralPlatformId],
  ['bu2YJQZCcJzpUQZTine5rBZHwTNVWznGEMRnUHPTMRv', neutralPlatformId],
  ['G6L1NE8tLYYzvMHYHbkHZqPFvfEsiRAsHSvyNQ2hut3o', gauntletPlatformId],
  ['HG5SYPLJuD9xT2vdGBwzCoYCVfVs2jJFtc8BLt1J6nY8', hedgyPlatformId],
  ['86fYXDydyKKnL7gxWpVrUDnsrVyQyZkwb4YsisBHC9ab', gauntletPlatformId],
  ['6HmPq4hU2BQqkogVuohggZwaqNFQRpRQ6MSE6bcKxCEa', vectisPlatformId],
  ['B8okK4ttA1w18JvPXPLecUZxsBbo1LNESuh3G31hm4Mf', m1CapitalPlatformId],
  ['ESRL2Rj2z7UTUzzRQQEGQbnHyJxcBEqP4BXxjBvZkzjR', knightradePlatformId],
  ['7n1eiWbLWRC3a7cggUcnM9gnudtwVJc8Xrs41ELGwGbE', luckyperpPlatformId],
  ['8KX7LUPnn94R2nXguftRJwyiDHFob4AS8DrNDYx7H3o5', nxFinancePlatformId],
]);

export const linksByPlatformId: Map<string, string> = new Map([
  [circuitPlatformId, 'https://app.circuit.trade/'],
  [moosePlatformId, 'https://moose.market/'],
  [neutralPlatformId, 'https://www.app.neutral.trade/'],
  [vectisPlatformId, 'https://app.vectis.finance/vault/'],
]);
