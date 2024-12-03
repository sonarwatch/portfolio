import { ID } from '../../utils/sui/types/id';
import { Custody } from './structs';

export type Receipt = {
  id: ID;
  amountDeposited: string;
};

export type CachedCustody = Custody & {
  pubkey: string;
};
