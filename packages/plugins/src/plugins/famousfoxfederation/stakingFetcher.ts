import { formatTokenAddress, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import {
  platformId,
  foxyMint,
  stakingConfigCacheKey,
  cachePrefix,
  foxProgram,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { stakingAccountStruct, StakingConfig } from './structs';
import { calcEarnings } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await ParsedGpa.build(
    connection,
    stakingAccountStruct,
    foxProgram
  )
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const [tokenPrice, configAccount] = await Promise.all([
    cache.getTokenPrice(
      formatTokenAddress(foxyMint, NetworkId.solana),
      NetworkId.solana
    ),
    cache.getItem<StakingConfig>(stakingConfigCacheKey, {
      prefix: cachePrefix,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!configAccount) throw new Error('Staking config not cached');

  if (!tokenPrice) throw new Error('Foxy price not found');

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://famousfoxes.com/stake',
  });

  accounts.forEach((stakingAccount) => {
    const amount = calcEarnings(stakingAccount, configAccount);
    element.addAsset({
      address: foxyMint,
      amount,
      alreadyShifted: true,
      ref: stakingAccount.pubkey.toString(),
      attributes: {
        isClaimable: true,
      },
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
