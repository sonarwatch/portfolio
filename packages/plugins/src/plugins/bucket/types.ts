export type CollateralFields = {
  id: string;
  name: string;
  value: {
    type: string;
    fields: {
      next: string;
      prev: string;
      value: {
        type: string;
        fields: {
          buck_amount: string;
          collateral_amount: string;
          id: {
            id: string;
          };
          reward_coll_snapshot: string;
          reward_debt_snapshot: string;
          stake_amount: string;
        };
      };
    };
  };
};
