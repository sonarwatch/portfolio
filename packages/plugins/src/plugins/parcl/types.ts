export type Allocation = {
  amount: number;
  merkleTree?: string;
};

export type ApiAirdropResponse = {
  amount?: number;
  merkle_tree?: string;
  error?: string;
};
