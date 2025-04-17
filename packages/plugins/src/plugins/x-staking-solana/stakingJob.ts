import { PublicKey } from '@solana/web3.js';
import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { xStakingConfigs } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const [vaultsAccounts, tokensInfos, tokensPricesMap] = await Promise.all([
    getParsedMultipleAccountsInfo(
      client,
      tokenAccountStruct,
      xStakingConfigs.map((conf) => new PublicKey(conf.vault))
    ),
    getParsedMultipleAccountsInfo(
      client,
      mintAccountStruct,
      xStakingConfigs.map((conf) => new PublicKey(conf.xMint))
    ),
    cache.getTokenPricesAsMap(
      xStakingConfigs.map((conf) => conf.mint),
      NetworkId.solana
    ),
  ]);

  for (let i = 0; i < xStakingConfigs.length; i++) {
    const config = xStakingConfigs[i];
    const tokenPrice = tokensPricesMap.get(config.mint);
    const [tokenInfo, vaultAccount] = [tokensInfos[i], vaultsAccounts[i]];

    if (!tokenInfo || !vaultAccount || !tokenPrice) continue;

    const xSupply = tokenInfo.supply.dividedBy(10 ** tokenInfo.decimals);

    const vaultTokenAmount = vaultAccount.amount.dividedBy(
      10 ** config.decimals
    );

    const xPrice = vaultTokenAmount.dividedBy(xSupply).times(tokenPrice.price);

    await cache.setTokenPriceSource({
      address: config.xMint,
      decimals: config.xDecimals,
      id: config.vault,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatformId,
      price: xPrice.toNumber(),
      timestamp: Date.now(),
      weight: 1,
    });
  }
};

const job: Job = {
  id: `x-staking-solana`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
