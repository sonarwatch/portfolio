import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export const solanaTokenPid = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const solanaTokenPidPk = new PublicKey(solanaTokenPid);

export const solanaToken2022Pid = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
export const solanaToken2022PidPk = new PublicKey(solanaToken2022Pid);

export const associatedTokenProgramId = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

export const usdcSolanaMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const usdcSolanaDecimals = 6;
export const usdcSolanaFactor = new BigNumber(10 ** 6);
export const emptyWithSol = 'empty11111111111111111111111111111111111111';

export const crtSolanaMint = 'CRTx1JouZhzSU6XytsE42UQraoGqiHgxabocVfARTy2s';