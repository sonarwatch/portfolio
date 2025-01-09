import { ID } from '../../../utils/sui/types/id';
import { BasicField, NameField } from './basic';

export type SpoolAccountFieldsType = {
  id: ID;
  index: string;
  points: string;
  spool_id: string;
  stake_type: BasicField<NameField>;
  stakes: string;
  total_points: string;
};

export type SpoolDataFieldsType = {
  created_at: string;
  distributed_point: string;
  distributed_point_per_period: string;
  id: ID;
  index: string;
  last_update: string;
  max_distributed_point: string;
  max_stakes: string;
  point_distribution_time: string;
  stake_type: BasicField<NameField>;
  stakes: string;
};

export type SpoolRewardFieldsType = {
  claimed_rewards: string;
  exchange_rate_denominator: string;
  exchange_rate_numerator: string;
  id: ID;
  rewards: string;
  spool_id: string;
};
