import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, legacyStakingProgramId, wMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { tokenBalanceStruct } from './structs';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const tokenBalances = await getParsedAccountInfo(
    client,
    tokenBalanceStruct,
    PublicKey.findProgramAddressSync(
      [Buffer.from('token_balance'), new PublicKey(owner).toBytes()],
      legacyStakingProgramId
    )[0]
  );

  if (!tokenBalances) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://w.wormhole.com/',
    ref: tokenBalances.pubkey.toString(),
    name: 'Old Legacy Stake',
  });

  element.addAsset({
    address: wMint,
    amount: tokenBalances.balance,
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-legacy-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
