export type TokenPairMetadataData = {
  balance_x: { value: string };
  balance_y: { value: string };
  token_x_details: {
    decimals: number;
    token_address: string;
  };
  token_y_details: {
    decimals: number;
    token_address: string;
  };
};
