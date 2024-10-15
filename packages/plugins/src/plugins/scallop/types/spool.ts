import { ExtendedBasicField, IdField, NameField } from './basic';

export type SpoolAccountFieldsType = {
  id: IdField;
  index: string;
  points: string;
  spool_id: string;
  stake_type: ExtendedBasicField<NameField>;
  stakes: string;
  total_points: string;
};
