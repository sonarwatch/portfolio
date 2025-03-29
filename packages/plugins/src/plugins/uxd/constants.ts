import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export const uxpMint = 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M';
export const platformId = 'uxd';

export const stakingProgramId = new PublicKey(
  'UXDSkps5NR8Lu1HB5uPLFfuB34hZ6DCk7RhYZZtGzbF'
);

export const uxpDecimal = 9;
export const uxpFactor = new BigNumber(10 ** uxpDecimal);
