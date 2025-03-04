export type CollectionResponse = {
  collections: Collection[];
};

export type Collection = {
  collectionId: number;
  name: string;
  whitelistType: {
    __t: 'CreatorWhitelist' | 'CollectionWhitelist';
    pubkey: string;
  };
  floorPrice: string;
  supply: string;
  currentLoan: string;
  maxLoan: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  pubkey: string;
  metadata: {
    tensorSlug: string;
    collectionName: string;
    collectionNameMe: string;
    collectionNameTensor: string;
    banner: string;
    thumbnail: string;
    lookupTable: string;
    isMortgageEnabled: boolean;
    url: string;
    magicEdenSlug: string;
  };
};
