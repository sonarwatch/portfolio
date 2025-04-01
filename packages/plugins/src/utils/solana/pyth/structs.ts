import {
  BeetStruct,
  dataEnum,
  DataEnumKeyAsKind,
  FixableBeet,
  FixableBeetArgsStruct,
  FixableBeetStruct,
  i32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u64 } from '../beets/numbers';

type VerificationLevelRecord = {
  Partial: {
    numSignatures: number;
  };
  Full: NonNullable<unknown>;
};

type VerificationLevel = DataEnumKeyAsKind<VerificationLevelRecord>;

const verificationLevelStruct = dataEnum<VerificationLevelRecord>([
  [
    'Partial',
    new FixableBeetArgsStruct<VerificationLevelRecord['Partial']>(
      [['numSignatures', u8]],
      'VerificationLevelRecord["Partial"]'
    ),
  ],
  [
    'Full',
    new FixableBeetArgsStruct<VerificationLevelRecord['Full']>(
      [],
      'VerificationLevelRecord["Full"]'
    ),
  ],
]) as FixableBeet<VerificationLevel>;

type PriceFeedMessage = {
  feedId: number[];
  price: BigNumber;
  conf: BigNumber;
  exponent: number;
  publishTime: BigNumber;
  prevPublishTime: BigNumber;
  emaPrice: BigNumber;
  emaConf: BigNumber;
};

const priceFeedMessageStruct = new BeetStruct<PriceFeedMessage>(
  [
    ['feedId', uniformFixedSizeArray(u8, 32)],
    ['price', i64],
    ['conf', u64],
    ['exponent', i32],
    ['publishTime', i64],
    ['prevPublishTime', i64],
    ['emaPrice', i64],
    ['emaConf', u64],
  ],
  (args) => args as PriceFeedMessage
);

export type PriceUpdateV2 = {
  accountDiscriminator: number[];
  writeAuthority: PublicKey;
  verificationLevel: VerificationLevel;
  priceMessage: PriceFeedMessage;
  postedSlot: BigNumber;
};

export const priceUpdateV2Struct = new FixableBeetStruct<PriceUpdateV2>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['writeAuthority', publicKey],
    ['verificationLevel', verificationLevelStruct],
    ['priceMessage', priceFeedMessageStruct],
    ['postedSlot', u64],
  ],
  (args) => args as PriceUpdateV2
);
