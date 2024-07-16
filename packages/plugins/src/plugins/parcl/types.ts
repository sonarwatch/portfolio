export type Allocation = {
  amount: number;
  merkleTree?: string;
};

export type ApiAirdropResponse = {
  amount?: number;
  merkle_tree?: string;
  error?: string;
};

export type PositionAccount = {
  owner: string;
  positions: Position[];
};

export type Position = {
  amount: number;
  activationEpoch: number;
  unlockingStart: number;
};
