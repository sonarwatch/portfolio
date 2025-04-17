import {
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../utils/clients';
import {
  platformId,
  platformIdByVault,
  restakingPid,
  restakingVaultsKey,
} from './constants';
import { vaultStruct } from './structs';
import { dataSizeFilter } from '../../utils/solana/filters';
import { Cache } from '../../Cache';
import { getParsedProgramAccounts } from '../../utils/solana';
import { Job, JobExecutor } from '../../Job';
import { RestakingVaultInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const vaultsAccounts = await getParsedProgramAccounts(
    client,
    vaultStruct,
    restakingPid,
    dataSizeFilter(vaultStruct.byteSize)
  );

  const vaultInfo: RestakingVaultInfo[] = vaultsAccounts.map((acc) => {
    const vaultPlatformId = platformIdByVault.get(acc.pubkey.toString());

    return {
      pubkey: acc.pubkey.toString(),
      vrtMint: acc.vrtMint.toString(),
      platformId: vaultPlatformId,
    };
  });

  const tokensPriceById = await cache.getTokenPricesAsMap(
    vaultsAccounts.map((acc) => acc.supportedMint.toString()),
    NetworkId.solana
  );

  const sources: TokenPriceSource[] = [];

  vaultsAccounts.forEach((acc) => {
    const tokenPrice = tokensPriceById.get(acc.supportedMint.toString());
    if (tokenPrice && !acc.vrtSupply.isZero()) {
      const vrtPrice = acc.tokensDeposited
        .times(tokenPrice.price)
        .dividedBy(acc.vrtSupply);

      sources.push({
        id: acc.pubkey.toString(),
        weight: 1,
        address: acc.vrtMint.toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        decimals: 9,
        price: vrtPrice.toNumber(),
        timestamp: Date.now(),
      });
    }
  });

  await cache.setTokenPriceSources(sources);

  await cache.setItem(restakingVaultsKey, vaultInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
