export const offerFilter = (owner: string) => [
  {
    memcmp: {
      offset: 116,
      bytes: owner,
    },
  },
  {
    dataSize: 181,
  },
];

export const buyOrderFilter = (owner: string) => [
  {
    memcmp: {
      offset: 146,
      bytes: owner,
    },
  },
  {
    dataSize: 187,
  },
];

export const sellOrderFilter = (owner: string) => [
  {
    memcmp: {
      offset: 115,
      bytes: owner,
    },
  },
  {
    dataSize: 187,
  },
];
