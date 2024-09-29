import { ID } from './id';

export type NftStruct = {
  id?: ID;
  name?: string;
  description?: string;
  url?: string;
  collection_id?: string;
  animation_url?: string;
  external_url?: string;
  attributes_keys?: string[];
  attributes_values?: string[];
  amount?: number | string;
  tick?: string;
  attributes?: {
    type: string;
    fields: {
      map: {
        type: string;
        fields: {
          contents: Attribute[];
        };
      };
    };
  };
};

export type Attribute = {
  type: string;
  fields: {
    key: string;
    value: string;
  };
};

export type NftDisplayData = {
  name?: string;
  description?: string;
  creator?: string;
  image_url?: string;
  project_url?: string;
  external_link?: string;
};
