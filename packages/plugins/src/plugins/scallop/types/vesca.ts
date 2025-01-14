import { ID } from '../../../utils/sui/types/id';
import { BasicField, NameField } from './basic';

type VeScaValueType = {
  locked_sca_amount: string;
  unlock_at: string;
};
export type VeSca = {
  id: ID;
  value: BasicField<VeScaValueType>;
} & NameField;
