import { BeetStruct, u128, u64 } from "@metaplex-foundation/beet";
import { publicKey } from "@metaplex-foundation/beet-solana";
import { GetProgramAccountsFilter } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export type account = {
  tokenMint: BigNumber;
  index: BigNumber;
};

export const accountStruct = new BeetStruct<any>(
  [
    ['tokenMint', u128],
    ['index', u128],
  ],
  (args) => args as any
);


export const vaultStruct = new BeetStruct<any>(
  [
    ['publicKey', publicKey],
    ['account', accountStruct],
  ],
  (args) => args as any
);

export const vaultFilter: GetProgramAccountsFilter[] = [
  { dataSize: vaultStruct.byteSize },
];
