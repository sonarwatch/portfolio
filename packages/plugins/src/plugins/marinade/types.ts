export type ReferreResponse = {
  pubkey: string;
  ratePerSecondPerSol: string;
  referredAmount: string;
  rewards: string;
  updatedAt: string;
};

export type StakerResponse = {
  pubkey: string;
  nativeStakeBalance: string;
  nativeStakeRewards: string;
  mSOLBalance: string;
  mSOLRewards: string;
  ratePerSecondPerSol: string;
  updatedAt: string;
};

export type Season2Response = {
  pubkey: string;
  ratePerSecondPerSol: string;
  updatedAt: string;
  staker: {
    mSOLBalance: string;
    mSOLRewards: string;
    nativeStakeBalance: string;
    nativeStakeRewards: string;
  };
  validator: {
    algoScoreBalance: string;
    algoScoreRewards: string;
  };
  governor: {
    vemndeDirectedStakeVotesBalance: string;
    vemndeDirectedStakeVotesRewards: string;
    latestSolPerDirectedVemnde: string;
  };
};
