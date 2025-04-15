import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { banxDecimals, banxMint, banxPid, platformId } from './constants';
import { BanxTokenStakeState, banxTokenStakeStruct } from './structs';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const banxFactor = new BigNumber(10 ** banxDecimals);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(client, banxTokenStakeStruct, banxPid)
    .addFilter('accountDiscriminator', [233, 60, 55, 117, 102, 180, 229, 154])
    .addFilter('user', new PublicKey(owner))
    .run();

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });
  for (const account of accounts) {
    if (account.banxStakeState === BanxTokenStakeState.Unstaked) continue;
    if (account.tokensStaked.isZero()) continue;

    element.addAsset({
      address: banxMint,
      amount: account.tokensStaked.dividedBy(banxFactor),
      alreadyShifted: true,
      ref: account.pubkey.toString(),
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
