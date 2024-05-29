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
