import { BasicField, IdField, NameField } from './basic';

export type SpoolAccountFieldsType = {
  id: IdField;
  index: string;
  points: string;
  spool_id: string;
  stake_type: BasicField<NameField>;
  stakes: string;
  total_points: string;
};
