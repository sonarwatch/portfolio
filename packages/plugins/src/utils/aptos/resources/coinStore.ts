import { MoveResource } from '../MoveResource';

export type CoinStoreResource = MoveResource<CoinStoreData>;
export type CoinStoreData = {
  coin: { value: string };
  deposit_events: {
    counter: string;
    guid: {
      id: {
        addr: string;
        creation_num: string;
      };
    };
  };
  frozen: boolean;
  withdraw_events: {
    counter: string;
    guid: {
      id: {
        addr: string;
        creation_num: string;
      };
    };
  };
};
