import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export enum BanxTokenStakeState {
  None,
  Staked,
  Unstaked,
}

export type BanxTokenStake = {
  buffer: Buffer;
  banxStakeState: BanxTokenStakeState;
  user: PublicKey;
  adventureSubscriptionsQuantity: BigNumber;
  tokensStaked: BigNumber;
  partnerPointsStaked: BigNumber;
  playerPointsStaked: BigNumber;
  banxNftsStakedQuantity: BigNumber;
  stakedAt: BigNumber;
  unstakedAt: BigNumber;
  farmedAmount: BigNumber;
  nftsStakedAt: BigNumber;
  nftsUnstakedAt: BigNumber;
  placeholderOne: PublicKey;
};

export const banxTokenStakeStruct = new BeetStruct<BanxTokenStake>(
  [
    ['buffer', blob(8)],
    ['banxStakeState', u8],
    ['user', publicKey],
    ['adventureSubscriptionsQuantity', u64],
    ['tokensStaked', u64],
    ['partnerPointsStaked', u64],
    ['playerPointsStaked', u64],
    ['banxNftsStakedQuantity', u64],
    ['stakedAt', u64],
    ['unstakedAt', u64],
    ['farmedAmount', u64],
    ['nftsStakedAt', u64],
    ['nftsUnstakedAt', u64],
    ['placeholderOne', publicKey],
  ],
  (args) => args as BanxTokenStake
);
