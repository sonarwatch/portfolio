import { PublicKey } from '@solana/web3.js';
import {
  BeetStruct,
  bool,
  u8,
  u16,
  utf8String,
  array,
  coption,
  COption,
  FixableBeetStruct,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

enum Key {
  Uninitialized = 0,
  MetadataV1 = 4,
}

type Creator = {
  address: PublicKey;
  verified: boolean;
  share: number;
};

const creatorBeet = new BeetStruct<Creator>(
  [
    ['address', publicKey],
    ['verified', bool],
    ['share', u8],
  ],
  (args) => args as Creator
);

type Collection = {
  verified: boolean;
  key: PublicKey;
};

const collectionBeet = new BeetStruct<Collection>(
  [
    ['verified', bool],
    ['key', publicKey],
  ],
  (args) => args as Collection
);

type Uses = {
  useMethod: number;
  remaining: BigNumber;
  total: BigNumber;
};

const usesBeet = new BeetStruct<Uses>(
  [
    ['useMethod', u8],
    ['remaining', u64],
    ['total', u64],
  ],
  (args) => args as Uses
);

type MetadataData = {
  name: string;
  symbol: string;

  uri: string;
  sellerFeeBasisPoints: number;
  creators: COption<Creator[]>;
};

const metadataDataBeet = new FixableBeetStruct<MetadataData>(
  [
    ['name', utf8String],
    ['symbol', utf8String],
    ['uri', utf8String],
    ['sellerFeeBasisPoints', u16],
    ['creators', coption(array(creatorBeet))],
  ],
  (args) => args as MetadataData
);

type CollectionDetails = {
  size: BigNumber;
};

const collectionDetailsBeet = new BeetStruct<CollectionDetails>(
  [['size', u64]],
  (args) => args as CollectionDetails
);

type ProgrammableConfig = {
  ruleSet: COption<PublicKey>;
};

const programmableConfigBeet = new FixableBeetStruct<ProgrammableConfig>(
  [['ruleSet', coption(publicKey)]],
  (args) => args as ProgrammableConfig
);

export type MetadataAccount = {
  key: Key;
  updateAuthority: PublicKey;
  mint: PublicKey;
  bump: number[];
  data: MetadataData;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: COption<number>;
  tokenStandard: COption<number>;
  collection: COption<Collection>;
  uses: COption<Uses>;
  collectionDetails: COption<CollectionDetails>;
  programmableConfig: COption<ProgrammableConfig>;
};

export const metadataAccountStruct = new FixableBeetStruct<MetadataAccount>(
  [
    ['key', u8],
    ['updateAuthority', publicKey],
    ['mint', publicKey],
    ['data', metadataDataBeet],
    ['primarySaleHappened', bool],
    ['isMutable', bool],
    ['editionNonce', coption(u8)],
    ['tokenStandard', coption(u8)],
    ['collection', coption(collectionBeet)],
    ['uses', coption(usesBeet)],
    ['collectionDetails', coption(collectionDetailsBeet)],
    ['programmableConfig', coption(programmableConfigBeet)],
  ],
  (args) => args as MetadataAccount
);
