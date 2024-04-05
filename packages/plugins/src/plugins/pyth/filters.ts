export const positionsDataFilter = (address: string) => [
  { memcmp: { offset: 0, bytes: 'FM2r3wAdZaa' } },
  {
    memcmp: {
      offset: 8,
      bytes: address,
    },
  },
];
