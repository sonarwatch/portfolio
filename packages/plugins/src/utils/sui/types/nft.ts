import { ID } from './id';

export type NFTContentFields = {
  // Common
  id: ID;
  collection_name?: string;
  description?: string;
  image_url?: string;

  // Attributes
  attributes?: {
    fields: {
      contents?: Attribute[];
      fields?: {
        fields: {
          contents: Attribute[];
        };
      };
    };
  };

  // MoveScriptions
  tick?: string;

  amount?: string;

  // # of the NFT
  number?: string;
  number_id?: string;

  // Others
  edition?: string;
  rarity?: string;
};

export type Attribute = {
  fields: {
    key: string;
    value: string;
  };
  type: string;
};

export type NftDisplayData = {
  name?: string;
  amount?: string;
  description?: string;
  creator?: string;
  image_url?: string;
  project_url?: string;
  external_link?: string;
};

export type SuiFrendFields = {
  attributes: string[];
  birth_location: string;
  birthdate: string;
  cohort: string;
  generation: string;
};

export const suiFrendsType =
  '0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy>';
