export const stakingAccountFilters = (address: string) => [
  {
    memcmp: {
      offset: 10,
      bytes: address,
    },
  },
];
