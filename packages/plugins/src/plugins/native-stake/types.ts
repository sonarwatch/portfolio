export type ValidatorInfo = {
  addr: string;
  config: {
    consensus_pubkey: string;
    fullnode_addresses: string;
    network_addresses: string;
    validator_index: string;
  };
  voting_power: string;
};

export type ValidatorSet = {
  type: string;
  data: {
    active_validators: ValidatorInfo[];
    consensus_scheme: string;
    pending_active: string[];
    pending_inactive: string[];
    total_joining_power: string;
    total_voting_power: string;
  };
};

export type DelegationResponse = {
  delegation: {
    delegatorAddress: string;
    validatorAddress: string;
    shares: string;
  };
  balance: { denom: string; amount: string };
};
