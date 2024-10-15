import { ExtendedBasicField, IdField, NameField } from './basic';

type VeScaValueType = {
  locked_sca_amount: string;
  unlock_at: string;
};
export type VeSca = {
  id: IdField;
  value: ExtendedBasicField<VeScaValueType>;
} & NameField;
