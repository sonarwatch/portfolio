import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { lendingProgramIds, lendingsCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { Lending, userInfoStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const userInfos = await getParsedMultipleAccountsInfo(
    connection,
    userInfoStruct,
    lendingProgramIds.map(
      (lendingProgramId) =>
        PublicKey.findProgramAddressSync(
          [Buffer.from('USER_INFOS'), new PublicKey(owner).toBuffer()],
          lendingProgramId
        )[0]
    )
  );

  if (!userInfos || userInfos.filter((u) => u !== null).length === 0) return [];

  const lendings = await cache.getItem<ParsedAccount<Lending>[]>(
    lendingsCacheKey,
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  if (!lendings) throw new Error('Lendings not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Lending',
    link: 'https://solana.vaultka.com/',
  });

  userInfos.forEach((userInfo, i) => {
    if (userInfo)
      element.addAsset({
        address: lendings[i].mint
          ? lendings[i].mint.toString()
          : solanaNativeAddress,
        amount: new BigNumber(lendings[i].vault_balance)
          .plus(lendings[i].borrowed_amount)
          .multipliedBy(userInfo.shares)
          .dividedBy(lendings[i].total_shares),
        ref: userInfo.pubkey.toString(),
        sourceRefs: [
          { name: 'Lending Market', address: lendings[i].pubkey.toString() },
        ],
      });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lending`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
