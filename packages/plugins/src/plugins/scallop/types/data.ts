import BigNumber from 'bignumber.js';
import { SuiObjectRef } from '@mysten/sui/client';
import { ID } from '../../../utils/sui/types/id';
import { BasicField } from './basic';

export type UserLending = {
  coinType: string;
  amount: BigNumber;
};

export type UserObligations = {
  [T in string]: {
    collaterals: { [K in string]: BigNumber };
    debts: { [K in string]: BigNumber };
    obligation: SuiObjectRef;
  };
};

export type UserLendingData = {
  [T in string]: UserLending;
};

export type UserStakeAccounts = {
  [T in string]: { points: string; index: string; stakes: string }[];
};

export type ClaimStatus = {
  name: string;
  value: number;
  id: ID;
};

export type TreasuryInfo = {
  claim_enabled: boolean;
  claim_record: ClaimRecord;
  id: ID;
  msg_author_pubkey: number[];
  treasury: string;
};

export type ClaimRecord = BasicField<BasicField<{ id: ID; size: string }>>;

export type ApiResponse = {
  signature: { [key: string]: number };
  data: string;
};

export type ChristmasReward = {
  value: string;
};
