import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { platformId, vaultsProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vaultStruct } from './struct';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import { vaultsFilters } from './filters';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const vaultAccounts = await getParsedProgramAccounts(
    client,
    vaultStruct,
    vaultsProgramId,
    vaultsFilters
  );

  const tokenPrices = await cache.getTokenPricesAsMap(
    vaultAccounts.map((vault) => vault.token_mint.toString()),
    NetworkId.solana
  );

  const lpSources: TokenPriceSource[] = [];
  for (let i = 0; i < vaultAccounts.length; i += 1) {
    const vault = vaultAccounts[i];
    if (vault.total_amount.isZero()) continue;
    const vaultTokenPrice = tokenPrices.get(vault.token_mint.toString());
    if (!vaultTokenPrice) continue;

    const lpSupplyRes = await fetchTokenSupplyAndDecimals(
      vault.lp_mint,
      client,
      0
    );
    if (!lpSupplyRes) continue;

    const { decimals: lpDecimals, supply: lpSupply } = lpSupplyRes;
    const vaultAmount = vault.total_amount
      .div(10 ** vaultTokenPrice.decimals)
      .toNumber();
    const vaultValue = vaultAmount * vaultTokenPrice.price;
    const price = vaultValue / lpSupply;
    const lpSource: TokenPriceSource = {
      id: platformId,
      weight: 1,
      address: vault.lp_mint.toString(),
      networkId: NetworkId.solana,
      platformId,
      elementName: 'Vault',
      decimals: lpDecimals,
      price,
      underlyings: [
        {
          networkId: NetworkId.solana,
          address: vaultTokenPrice.address,
          decimals: vaultTokenPrice.decimals,
          price: vaultTokenPrice.price,
          amountPerLp: price / vaultTokenPrice.price,
        },
      ],
      timestamp: Date.now(),
    };
    lpSources.push(lpSource);
  }
  await cache.setTokenPriceSources(lpSources);
};

const job: Job = {
  id: `${platformId}-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
