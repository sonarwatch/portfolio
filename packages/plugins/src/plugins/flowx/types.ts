export type StakingPosition = {
  id: {
    id: string;
  };
  name: string;
  value: {
    type: string;
    fields: {
      amount: string;
      flx_pending: string;
      sui_pending: string;
    };
  };
};
