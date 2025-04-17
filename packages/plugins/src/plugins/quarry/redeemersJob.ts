import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  IOUTokensElementName,
  platformId,
  quarryRedeemerProgramId,
  redeemerProgramId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { quarryRedeemerStruct, redeemerStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const accounts = (
    await Promise.all([
      ParsedGpa.build(
        connection,
        quarryRedeemerStruct,
        quarryRedeemerProgramId
      ).run(),
      ParsedGpa.build(connection, redeemerStruct, redeemerProgramId).run(),
    ])
  ).flat();

  if (accounts.length === 0) return;

  const sources: TokenPriceSource[] = [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    accounts.map((acc) => acc.redemptionMint.toString()),
    NetworkId.solana
  );

  accounts.forEach((acc) => {
    const redemptionTokenPrice = tokenPrices.get(acc.redemptionMint.toString());
    if (!redemptionTokenPrice) return;

    sources.push({
      address: acc.iouMint.toString(),
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
          address: acc.redemptionMint.toString(),
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
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
