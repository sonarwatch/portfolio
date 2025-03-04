import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakingProgramId, wMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { tokenBalanceStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const tokenBalances = await getParsedMultipleAccountsInfo(
    client,
    tokenBalanceStruct,
    [
      PublicKey.findProgramAddressSync(
        [Buffer.from('token_balance'), new PublicKey(owner).toBytes()],
        stakingProgramId
      )[0],
    ]
  );

  if (!tokenBalances.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://w.wormhole.com/',
  });

  tokenBalances.forEach((tokenBalance) => {
    if (!tokenBalance) return;
    element.addAsset({
      address: wMint,
      amount: tokenBalance?.balance,
      ref: tokenBalance.pubkey.toString(),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
