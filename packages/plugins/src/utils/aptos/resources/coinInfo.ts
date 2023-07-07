import { MoveResource } from '../MoveResource';

export type CoinInfoResource = MoveResource<CoinInfoData>;
export type CoinInfoData = {
  decimals: number;
  name: string;
  symbol: string;
  supply?: {
    vec:
      | [
          {
            aggregator: {
              vec:
                | [
                    {
                      limit: string;
                      value: string;
                    }
                  ]
                | [];
            };
            integer: {
              vec:
                | [
                    {
                      limit: string;
                      value: string;
                    }
                  ]
                | [];
            };
          }
        ]
      | [];
  };
};
