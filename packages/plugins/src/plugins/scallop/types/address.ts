export interface AddressInfo {
  id: string;
  mainnet: Network;
  testnet?: Network;
  createdAt: string;
  updatedAt: string;
  memo: string;
}

interface Network {
  core: Core;
  spool: Spool;
  borrowIncentive: BorrowIncentive;
  vesca: VeSca;
  referral: Referral;
  loyaltyProgram: LoyaltyProgram;
  scoin: {
    id: string;
    coins: Record<string, SCoin>;
  };
}

interface LoyaltyProgram {
  id: string;
  object: string;
  rewardPool: string;
  userRewardTableId: string;
}

interface Spool {
  id: string;
  adminCap: string;
  pools: Map<string, SpoolCoin>;
}

interface BorrowIncentive {
  id: string;
  adminCap: string;
  object: string;
  query: string;
  incentivePools: string;
  incentiveAccounts: string;
  config: string;
  version: string;
  versionCap: string;
}

interface VeSca {
  id: string;
  object: string;
  adminCap: string;
  tableId: string;
  table: string;
  treasury: string;
  config: string;
}

interface Referral {
  id: string;
  object: string;
  adminCap: string;
  referralBindings: string;
  bindingTableId: string;
  referralRevenuePool: string;
  revenueTableId: string;
  referralTiers: string;
  tiersTableId: string;
  authorizedWitnessList: string;
  version: string;
}

interface Core {
  version: string;
  versionCap: string;
  market: string;
  adminCap: string;
  coinDecimalRegistry: string;
  coins: Map<string, Coin>;
  oracles: Oracle;
  packages: Map<string, Package>;
  object: string;
}

interface Coin {
  id: string;
  metaData: string;
  treasury: string;
  oracle: CoinOracle;
}

interface SCoin {
  coinType: string;
  treasury: string;
  metaData: string;
}

interface SpoolCoin {
  id: string;
  rewardPoolId: string;
}

interface CoinOracle {
  supra: string;
  switchboard: string;
  pyth: CoinOraclePyth;
}

interface CoinOraclePyth {
  feed: string;
  feedObject: string;
}

interface Oracle {
  xOracle?: string;
  xOracleCap?: string;
  supra?: Supra;
  pyth?: Pyth;
  switchboard?: Switchboard;
}

interface Supra {
  registry: string;
  registryCap: string;
  holder: string;
}

interface Pyth {
  registry: string;
  registryCap: string;
  state: string;
  wormhole: string;
  wormholeState: string;
}

interface Switchboard {
  registry: string;
  registryCap: string;
}

interface Package {
  id: string;
  upgradeCap: string;
}
