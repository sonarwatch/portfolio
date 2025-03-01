import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../../utils/solana';

export enum Status {
  Active,
  Filled,
  Canceled,
}

export type Order = {
  buffer: Buffer;
  globalConfig: PublicKey;
  maker: PublicKey;
  inputMint: PublicKey;
  inputMintProgramId: PublicKey;
  outputMint: PublicKey;
  outputMintProgramId: PublicKey;
  initialInputAmount: BigNumber;
  expectedOutputAmount: BigNumber;
  remainingInputAmount: BigNumber;
  filledOutputAmount: BigNumber;
  tipAmount: BigNumber;
  numberOfFills: BigNumber;
  orderType: number;
  status: Status;
  inVaultBump: number;
  flashIxLock: number;
  padding0: number[];
  lastUpdatedTimestamp: BigNumber;
  flashStartTakerOutputBalance: BigNumber;
  padding: BigNumber[];
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['buffer', blob(8)],
    ['globalConfig', publicKey],
    ['maker', publicKey],
    ['inputMint', publicKey],
    ['inputMintProgramId', publicKey],
    ['outputMint', publicKey],
    ['outputMintProgramId', publicKey],
    ['initialInputAmount', u64],
    ['expectedOutputAmount', u64],
    ['remainingInputAmount', u64],
    ['filledOutputAmount', u64],
    ['tipAmount', u64],
    ['numberOfFills', u64],
    ['orderType', u8],
    ['status', u8],
    ['inVaultBump', u8],
    ['flashIxLock', u8],
    ['padding0', uniformFixedSizeArray(u8, 4)],
    ['lastUpdatedTimestamp', u64],
    ['flashStartTakerOutputBalance', u64],
    ['padding', uniformFixedSizeArray(u64, 19)],
  ],
  (args) => args as Order
);
