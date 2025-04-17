import { PublicKey } from '@solana/web3.js';
import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { strategyStruct, vaultStruct } from './structs';
import { loopscaleProgramId, platformId, vaultsCacheKey } from './constants';
import {
  bytesToNumberLE,
  getMarginFiAccountBalance,
  getProgramAddress,
} from './helpers';
import {
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
} from '../../utils/solana';
import { Cache } from '../../Cache';
import { CachedVault } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const vaults = await ParsedGpa.build(
    connection,
    vaultStruct,
    loopscaleProgramId
  )
    .addFilter('accountDiscriminator', [211, 8, 232, 43, 2, 152, 117, 119])
    .run();

  if (!vaults.length) throw new Error('No Vaults accounts found');

  const strategyMap: { [vault: string]: PublicKey } = {};

  vaults.forEach((vault) => {
    const seeds = [Buffer.from('strategy'), vault.pubkey.toBytes()];
    strategyMap[vault.pubkey.toBase58()] = getProgramAddress(
      seeds,
      loopscaleProgramId
    );
  });

  const strats = Object.values(strategyMap);

  const accounts = await getParsedMultipleAccountsInfo(
    connection,
    strategyStruct,
    strats
  );
  const now = Math.floor(Date.now() / 1000);

  const cachedVaults: CachedVault[] = [];
  const tokenPriceSources: TokenPriceSource[] = [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    vaults.map((v) => v.principal_mint.toString()),
    NetworkId.solana
  );

  for (let i = 0; i < vaults.length; i++) {
    const vault = vaults[i];
    const strategyAddress = strategyMap[vault.pubkey.toString()];
    const stratPubkey = new PublicKey(strategyAddress);
    const accountIndex = strats.indexOf(strategyAddress);
    if (accountIndex >= 0) {
      const strat = accounts[accountIndex];
      if (!strat) continue;
      const principalMint = strat.principal_mint;
      const externalYieldSource = strat.external_yield_source;
      let balance = 0;
      if (externalYieldSource === 1) {
        // Marginfi, add this account to loader
        const mfiBalance = await getMarginFiAccountBalance(stratPubkey, cache);
        balance += mfiBalance; // mrgn balance
      } else {
        const stratTAs = await connection.getTokenAccountsByOwner(stratPubkey, {
          mint: principalMint,
        });

        stratTAs.value.forEach((accountInfo) => {
          const decodedAccount = tokenAccountStruct.read(
            accountInfo.account.data,
            0
          );
          balance += Number(decodedAccount.amount);
        });
      }

      const lastAccruedTimestamp = bytesToNumberLE(
        new Uint8Array(strat.last_accrued_timestamp.array)
      );
      const interestPerSecond =
        bytesToNumberLE(new Uint8Array(strat.interest_per_second.array)) / 1e18;
      const currentDeployedAmount = bytesToNumberLE(
        new Uint8Array(strat.current_deployed_amount.array)
      );
      const accruedDelta = now - lastAccruedTimestamp;
      const deployedAmount =
        currentDeployedAmount + interestPerSecond * accruedDelta;
      balance += deployedAmount;
      cachedVaults.push({
        pubkey: vault.pubkey.toString(),
        lp_mint: vault.lp_mint.toString(),
        principal: principalMint.toString(),
        price: balance / bytesToNumberLE(new Uint8Array(vault.lp_supply.array)),
      });

      const principalTokenPrice = tokenPrices.get(principalMint.toString());
      if (principalTokenPrice) {
        const priceInPrincipal =
          balance / bytesToNumberLE(new Uint8Array(vault.lp_supply.array));
        tokenPriceSources.push({
          id: vault.pubkey.toString(),
          weight: 1,
          address: vault.lp_mint.toString(),
          networkId: NetworkId.solana,
          platformId,
          decimals: principalTokenPrice.decimals,
          price: principalTokenPrice.price * priceInPrincipal,
          underlyings: [
            {
              address: principalMint.toString(),
              amountPerLp: priceInPrincipal,
              decimals: principalTokenPrice.decimals,
              networkId: NetworkId.solana,
              price: principalTokenPrice.price,
            },
          ],
          label: 'LiquidityPool',
          timestamp: Date.now(),
          link: `https://app.loopscale.com/vault/AXanCP4dJHtWd7zY4X7nwxN5t5Gysfy2uG3XTxSmXdaB${vault.pubkey}`,
          sourceRefs: [
            {
              name: 'Vault',
              address: vault.pubkey.toString(),
            },
          ],
        });
      }
    }
  }

  await cache.setTokenPriceSources(tokenPriceSources);
  await cache.setItem(vaultsCacheKey, cachedVaults, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
