import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, vaultsProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vaultStruct } from './struct';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const vaultAccounts = await getParsedProgramAccounts(
    client,
    vaultStruct,
    vaultsProgramId
  );

  for (let i = 0; i < vaultAccounts.length; i += 1) {
    const vault = vaultAccounts[i];
    if (vault.total_amount.isZero()) continue;
    const vaultTokenPrice = await cache.getTokenPrice(
      vault.token_mint.toString(),
      NetworkId.solana
    );
    if (!vaultTokenPrice) continue;

    const lpSupplyRes = await fetchTokenSupplyAndDecimals(
      new PublicKey(vault.lp_mint.toString()),
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
    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: vault.lp_mint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: lpDecimals,
      price,
      underlyings: [
        {
          networkId: NetworkId.solana,
          address: vaultTokenPrice.address,
          decimals: vaultTokenPrice.decimals,
          price: vaultTokenPrice.price,
          amountPerLp: vaultAmount / vaultValue,
        },
      ],
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  executor,
};
export default job;
