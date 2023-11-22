import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'convex';
export const platform: Platform = {
  id: platformId,
  name: 'Convex',
  image: 'https://sonar.watch/img/platforms/convex.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  // website: 'https://myplatform.com',
  // twitter: 'https://twitter.com/myplatform',
};

export const curvePoolsApi = 'https://www.convexfinance.com/api/curve/pools';
export const prismaPoolsApi =
  'https://frax.convexfinance.com/api/prisma/convex-pools';

export const curvePoolsArbitrumApi =
  'https://www.convexfinance.com/api/curve/pools-arbitrum';

export const curvePoolsPolygonApi =
  'https://www.convexfinance.com/api/curve/pools-polygon';

export const fraxPoolsApi = 'https://frax.convexfinance.com/api/frax/pools';

export const poolsKey = 'pools';
