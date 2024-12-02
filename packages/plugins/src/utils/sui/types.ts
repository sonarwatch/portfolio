import { SuiEvent, SuiObjectData, SuiObjectResponse } from '@mysten/sui/client';
import { ID } from './types/id';

export type ParsedData<K> = {
  hasPublicTransfer: boolean;
  type: string;
  dataType: 'moveObject';
  fields: K;
};

export type ParsedDataPackage = {
  dataType: 'package';
  disassembled: {
    [key: string]: unknown;
  };
};

export type ObjectData<K> = SuiObjectData & {
  type: string;
  content: ParsedData<K> | null;
};

export type ObjectResponse<K> = SuiObjectResponse & {
  data?: ObjectData<K> | null;
};

export type Event<K> = SuiEvent & {
  parsedJson?: K;
};

export type AirdropWrapperNFT = {
  balance: string;
  id: ID;
};

export type DeepAirdropNFT = {
  amount: string;
  id: ID;
};

export type StructTag = {
  address: string;
  module: string;
  name: string;
  typeParams: (string | StructTag)[];
};
