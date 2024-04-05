import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { locksPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, usdcSolanaMint } from '../../utils/solana';
import { orderStateLockStruct } from './struct';
import { locksFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const locksAccounts = await getParsedProgramAccounts(
    client,
    orderStateLockStruct,
    locksPid,
    locksFilter(owner)
  );

  const tokenPricesById = await getTokenPricesMap(
    [solanaNativeAddress, usdcSolanaMint],
    NetworkId.solana,
    cache
  );

  let solAmount = 0;
  let usdcAmount = 0;
  const assets: PortfolioAsset[] = [];
  for (const account of locksAccounts) {
    if (account.currency.toString() !== usdcSolanaMint) {
      solAmount += account.price.dividedBy(10 ** 9).toNumber();
    } else {
      usdcAmount += account.price.dividedBy(10 ** 6).toNumber();
    }
  }

  if (usdcAmount)
    assets.push(
      tokenPriceToAssetToken(
        usdcSolanaMint,
        usdcAmount,
        NetworkId.solana,
        tokenPricesById.get(usdcSolanaMint)
      )
    );
  if (solAmount)
    assets.push(
      tokenPriceToAssetToken(
        solanaNativeAddress,
        solAmount,
        NetworkId.solana,
        tokenPricesById.get(solanaNativeAddress)
      )
    );

  if (assets.length === 0) return [];
  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      name: 'Locks',
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};
const fetcher: Fetcher = {
  id: `${platformId}-locks`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
