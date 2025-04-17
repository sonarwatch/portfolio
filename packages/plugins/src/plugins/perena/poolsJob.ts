import {
  NetworkId,
  solanaNativeAddress,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { pid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
} from '../../utils/solana';
import { liquidityStruct } from './structs';
import {
  getLpTokenSourceRaw,
  PoolUnderlyingRaw,
} from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const lpAccounts = await getParsedProgramAccounts(
    client,
    liquidityStruct,
    pid,
    [{ dataSize: liquidityStruct.byteSize }]
  );
  if (!lpAccounts) return;

  const [lpMintAccounts, tokenPriceById] = await Promise.all([
    getParsedMultipleAccountsInfo(
      client,
      mintAccountStruct,
      lpAccounts.map((lp) => lp.lp_mint)
    ),
    cache.getTokenPricesAsMap(
      lpAccounts.map((acc) => acc.pairs.map((p) => p.x_mint.toString())).flat(),
      NetworkId.solana
    ),
  ]);

  const sources: TokenPriceSource[] = [];

  for (let n = 0; n < lpAccounts.length; n += 1) {
    const lpAccount = lpAccounts[n];
    const lpMintAccount = lpMintAccounts[n];
    if (!lpMintAccount) continue;

    const underlyings: PoolUnderlyingRaw[] = lpAccount.pairs
      .map((pair, index) => {
        if (pair.pair_authority.toString() === solanaNativeAddress) return [];

        const tokenPrice = tokenPriceById.get(pair.x_mint.toString());
        return {
          address: pair.x_mint.toString(),
          reserveAmountRaw: pair.x_reserve_amount,
          weight: new BigNumber(lpAccount.weights[index])
            .dividedBy(lpAccount.total_weight)
            .toNumber(),
          decimals: pair.decimals,
          tokenPrice,
        };
      })
      .flat();

    const isUsdStar =
      lpAccount.lp_mint.toString() ===
      'BenJy1n3WTx9mTjEvy63e8Q1j4RqUc6E4VBMz3ir4Wo6';

    const lpSources = getLpTokenSourceRaw({
      lpDetails: {
        address: lpAccount.lp_mint.toString(),
        decimals: lpAccount.decimals,
        supplyRaw: lpMintAccount.supply,
      },
      networkId: NetworkId.solana,
      platformId: isUsdStar ? walletTokensPlatformId : platformId,
      poolUnderlyingsRaw: underlyings,
      sourceId: lpAccount.pubkey.toString(),
      priceUnderlyings: true,
    });

    sources.push(...lpSources);
  }

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
