export type ConfigAccount = {
  lamports: number;
  configKeys: {
    keysTuple: [string, boolean][];
  };
  info: string;
};

export type ValidatorConfig = {
  voter: string;
  name?: string;
  iconUrl?: string;
};

export type Validator = ValidatorConfig & {
  commission?: number;
};
