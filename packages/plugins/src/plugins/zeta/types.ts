export type GQLResponse = {
  getAirdropFinalFrontend: GetAirdropFinalFrontend;
};

export type GetAirdropFinalFrontend = {
  authority: string;
  community_allocation: number;
  eligibility: string;
  main_allocation: number;
  og_allocation: number;
  s1_allocation: number;
  s2_allocation: number;
  total_allocation: number;
  __typename: string;
};

export enum StakeStateName {
  Uninitialized,
  Vesting,
  Locked,
}

export type StakeState = {
  vesting?: {
    lastClaimTs: string;
    stakeStartEpoch: number;
  };
  locked?: null;
  uninitialized?: null;
};

export type StakeAccount = {
  buffer: Buffer;
  name: number[];
  vaultNonce: number;
  bitInUse: number;
  stakeState: StakeState;
  initialStakeAmount: string;
  amountStillStaked: string;
  amountClaimed: string;
  stakeDurationEpochs: number;
  authority: string;
};
