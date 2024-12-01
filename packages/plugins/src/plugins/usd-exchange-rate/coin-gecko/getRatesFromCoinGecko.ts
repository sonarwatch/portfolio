import { getPricesFromCoingeckoIds } from '../../tokens/helpers';

export default async function getRatesFromCoinGecko(names: string[]) {
  const res = await getPricesFromCoingeckoIds(new Set(names));
  return res;
}
