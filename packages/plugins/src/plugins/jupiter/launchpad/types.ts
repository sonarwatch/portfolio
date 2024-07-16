import { AirdropStatics } from '../../../AirdropFetcher';

export type AirdropConfig = {
  statics: AirdropStatics;
  label: string;
  mint: string;
  decimals: number;
  distributorProgram: string;
  platformId: string;
  getApiPath: (owner: string) => string;
};
