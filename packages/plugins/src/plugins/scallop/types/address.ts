export interface AddressInfo {
  id: string;
  mainnet: Network;
  testnet?: Network;
  createdAt: string;
  updatedAt: string;
  memo: string;
}

export interface Network {
  core: Core;
}

export interface Core {
  version: string;
  versionCap: string;
  market: string;
  adminCap: string;
  coinDecimalRegistry: string;
  coins: Map<string, Coin>;
  oracles: Oracle;
  packages: Map<string, Package>;
}

export interface Coin {
  id: string;
  metaData: string;
  treasury: string;
  oracle: CoinOracle;
}

export interface CoinOracle {
  supra: string;
  switchboard: string;
  pyth: CoinOraclePyth;
}

export interface CoinOraclePyth {
  feed: string;
  feedObject: string;
}

export interface Oracle {
  xOracle?: string;
  xOracleCap?: string;
  supra?: Supra;
  pyth?: Pyth;
  switchboard?: Switchboard;
}

export interface Supra {
  registry: string;
  registryCap: string;
  holder: string;
}

export interface Pyth {
  registry: string;
  registryCap: string;
  state: string;
  wormhole: string;
  wormholeState: string;
}

export interface Switchboard {
  registry: string;
  registryCap: string;
}

export interface Package {
  id: string;
  upgradeCap: string;
}
