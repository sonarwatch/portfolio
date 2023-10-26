export type ContractInfo = {
  chain: string;
  address: `0x${string}`;
  provider?: string;
};

export type PoolInfo = {
  totalSupply: string;
  balances: string[];
};
