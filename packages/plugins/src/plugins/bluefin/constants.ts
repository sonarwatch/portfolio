import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropStatics } from '../../AirdropFetcher';

export const platformId = 'bluefin';
export const platform: Platform = {
  id: platformId,
  name: 'Bluefin',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/bluefin.webp',
  defiLlamaId: 'parent#bluefin', // from https://defillama.com/docs/api
  website: 'https://trade.bluefin.io/',
  twitter: 'https://x.com/bluefinapp',
};

export const airdropStatics: AirdropStatics = {
  claimLink: 'https://trade.bluefin.io/airdrop',
  emitterLink: 'https://trade.bluefin.io/',
  emitterName: platform.name,
  id: 'bluefin-airdrop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/bluefin.webp',
  claimEnd: undefined,
  claimStart: undefined,
};

export const blueMint = undefined;

export const airdropApi =
  'https://dapi.api.sui-prod.bluefin.io/growth/airdropEligibility/allocation';

export const aquaVault =
  '0x10d48e112b92c8af207c1850225284a7ca46bac1d935c4af4cf87ce29b121694';

export const bankObjectId =
  '0x39c65abefaee0a18ffa0e059a0074fcc9910216fa1a3550aa32c2e0ec1c03043';

export const poolKey = 'pool';
export const perpetualIdsKey = 'perpetualIdsKey';

export const metaUrl = 'https://dapi.api.sui-prod.bluefin.io/meta';

export const clmmsPoolsKey = 'clmms-pools';
export const clmmPoolCreatedEventType = `0x3492c874c1e3b3e2984e8c41b589e642d4d0a5d6459e5a9cfc2d52fd7c89c267::events::PoolCreated`;
export const clmmPoolsApiUrl = `https://swap.api.sui-prod.bluefin.io/api/v1/pools/info`;
export const clmmPoolPositionType =
  '0x3492c874c1e3b3e2984e8c41b589e642d4d0a5d6459e5a9cfc2d52fd7c89c267::position::Position';
export const clmmPackage =
  '0xa31282fc0a0ad50cf5f20908cfbb1539a143f5a38912eb8823a8dd6cbf98bc44';
