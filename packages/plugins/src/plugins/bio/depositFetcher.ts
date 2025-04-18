import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { pid, platformId, tokenStatsKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { TokenStatsParsed, userStatsStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const tokenStatsMemo = new MemoizedCache<TokenStatsParsed[]>(tokenStatsKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const tokenStatsAccounts = await tokenStatsMemo.getItem(cache);
  if (!tokenStatsAccounts) throw new Error('Token stats not found in cache');

  const userStatsAccounts = await ParsedGpa.build(
    connection,
    userStatsStruct,
    pid
  )
    .addFilter('accountDiscriminator', [176, 223, 136, 27, 122, 79, 32, 227])
    .addDataSizeFilter(55)
    .addFilter('userId', new PublicKey(owner))
    .run();
  if (!userStatsAccounts) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  userStatsAccounts.forEach((acc) => {
    if (acc.isClaimed) return;

    const tokenStatsAcc = tokenStatsAccounts.find(
      (b) => b.tokenId === acc.tokenId
    );
    if (!tokenStatsAcc) return;
    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      ref: acc.pubkey,
      name: `${tokenStatsAcc.tokenMint.slice(0, 6)} Auction`,
      link: `https://app.bio.xyz/portfolio`,
      sourceRefs: [{ address: tokenStatsAcc.pubkey, name: 'Pool' }],
    });

    const endTime = new BigNumber(tokenStatsAcc.endTime).times(1000).toNumber();

    if (endTime < Date.now()) {
      // Auction is over, user can claim his tokens
      element.addAsset({
        address: tokenStatsAcc.tokenMint,
        amount: acc.tokensPurchased.dividedBy(10 ** tokenStatsAcc.decimals),
        alreadyShifted: true,
        attributes: {
          isClaimable: true,
        },
      });
    } else {
      // User made a payment to receive the new tokens at the end of the auction
      const paymentDeposited = acc.tokensPurchased
        .dividedBy(tokenStatsAcc.claimedSupply)
        .times(tokenStatsAcc.revenue);

      element.addAsset({
        address: tokenStatsAcc.paymentToken,
        amount: paymentDeposited,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
