import { fuzioPlatform, seaswapPlatform } from '../../platforms';

export const lpsContractsPrefix = 'lpcontracts';

export const lpsCodeByPlatform: Map<string, number[]> = new Map([
  [seaswapPlatform.id, [15]],
  [fuzioPlatform.id, [57]],
]);

export const lpsNamesByPlatform: Map<string, string[]> = new Map([
  [seaswapPlatform.id, ['SeaSwap_Liquidity_Token']],
  [fuzioPlatform.id, []],
]);
