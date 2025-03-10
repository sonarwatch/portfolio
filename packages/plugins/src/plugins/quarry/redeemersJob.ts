import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  IOUTokensElementName,
  platformId,
  quarryRedeemerIdlItem,
  redeemerIdlItem,
} from './constants';
import { Redeemer } from './types';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedProgramAccounts } from '../../utils/solana';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const accounts = (
    await Promise.all([
      getAutoParsedProgramAccounts<Redeemer>(connection, quarryRedeemerIdlItem),
      getAutoParsedProgramAccounts<Redeemer>(connection, redeemerIdlItem),
    ])
  ).flat();

  if (accounts.length === 0) return;

  const sources: TokenPriceSource[] = [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    accounts.map((acc) => acc.redemptionMint),
    NetworkId.solana
  );

  accounts.forEach((acc) => {
    const redemptionTokenPrice = tokenPrices.get(acc.redemptionMint);
    if (!redemptionTokenPrice) return;

    sources.push({
      address: acc.iouMint,
      decimals: redemptionTokenPrice.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price: redemptionTokenPrice.price,
      timestamp: Date.now(),
      weight: 1,
      elementName: IOUTokensElementName,
      underlyings: [
        {
          address: acc.redemptionMint,
          decimals: redemptionTokenPrice.decimals,
          amountPerLp: 1,
          networkId: NetworkId.solana,
          price: redemptionTokenPrice.price,
        },
      ],
    });
  });

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-redeemers`,
  executor,
  labels: ['normal'],
};
export default job;
