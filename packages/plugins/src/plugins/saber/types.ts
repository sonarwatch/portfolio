export interface SaberSwap {
  addresses: Addresses;
  currency: Currency;
  decimals: number;
  displayTokens: string[];
  id: string;
  isVerified: boolean;
  name: string;
  sources: string[];
  underlyingTokens: string[];
  tags?: Tag[];
  newPoolID?: string;
}

export interface Addresses {
  admin: string;
  lpTokenMint: string;
  mergePool: string;
  quarry: string;
  reserves: string[];
  swapAccount: string;
  swapAuthority: string;
}

export enum Currency {
  Btc = 'BTC',
  Eth = 'ETH',
  Eur = 'EUR',
  Ftt = 'FTT',
  Luna = 'LUNA',
  Sol = 'SOL',
  Srm = 'SRM',
  Try = 'TRY',
  Usd = 'USD',
}

export enum Tag {
  Allbridge = 'allbridge',
  Cashio = 'cashio',
  Port = 'port',
  Solend = 'solend',
  Synthetify = 'synthetify',
  WormholeV1 = 'wormhole-v1',
  WormholeV2 = 'wormhole-v2',
}
