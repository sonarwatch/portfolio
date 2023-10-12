import { Platform } from '@sonarwatch/portfolio-core';
import { coinInfo } from '../../utils/aptos';

export const platformId = 'pancakeswap';
export const pancakeswapPlatform: Platform = {
  id: platformId,
  name: 'PancakeSwap',
  image: 'https://alpha.sonar.watch/img/platforms/pancakeswap.png',
  defiLlamaId: 'pancakeswap',
};
export const programAddress =
  '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa';

export const lpTypePrefix = `${programAddress}::swap::LPToken<`;
export const lpCoinInfoTypePrefix = `${coinInfo}<${lpTypePrefix}`;
