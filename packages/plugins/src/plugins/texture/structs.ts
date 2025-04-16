import { BeetStruct } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { blob } from '../../utils/solana';

export type User = {
  buffer: Buffer;
  owner: PublicKey;
};

export const userStruct = new BeetStruct<User>(
  [
    ['buffer', blob(24)],
    ['owner', publicKey],
  ],
  (args) => args as User
);
