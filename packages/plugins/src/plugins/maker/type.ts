import { TokenPrice } from '@sonarwatch/portfolio-core';

export type IlkData = {
  id: string;
  pos: number;
  join: string;
  gem: string;
  dec: number;
  class: number;
  pip: string;
  xlip: string;
  name: string;
  symbol: string;
  art: string;
  rate: string;
  spot: string;
  line: string;
  dust: string;
  gemTokenPrice?: TokenPrice;
};
