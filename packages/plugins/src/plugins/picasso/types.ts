export type Vault = {
  stakeTimestampSec: string;
  service: {
    guestChain: {
      validator: string;
    };
  };
  stakeAmount: string;
  stakeMint: string;
  lastReceivedRewardsHeight: string;
  withdrawalRequest?: WithdrawalRequestParams;
};

export type WithdrawalRequestParams = {
  timestampInSec: string;
  owner: string;
  tokenAccount: string;
};
