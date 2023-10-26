export type ContractInfo = {
  chain: string;
  address: `0x${string}`;
  token: `0x${string}`;
  underlyings: `0x${string}`[];
  poolId: `0x${string}`;
  vault: `0x${string}`;
  provider?: string;
};

export type BptInfo = {
  farming: {
    totalSupply: string;
    balances: string[];
  };
  staking: {
    totalSupply: string;
    balances: string[];
  };
};
