export type VeSca = {
  id: {
    id: string;
  };
  name: string;
  value: {
    type: string;
    fields: { locked_sca_amount: string; unlock_at: string };
  };
};
