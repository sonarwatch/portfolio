import {
  NetworkId,
  PortfolioElement,
  yieldFromApr,
  yieldFromApy,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import {
  jlpMint,
  jlpPoolPk,
  perpBorrowAprCacheKey,
  perpsProgramId,
  platformId,
  USDC_CUSTODY_PUBLIC_KEY,
} from './constants';
import { borrowPositionStruct } from './structs';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { getParsedAccountInfo } from '../../../utils/solana/getParsedAccountInfo';
import { usdcSolanaMint } from '../../../utils/solana';
import { MemoizedCache } from '../../../utils/misc/MemoizedCache';

export const borrowAprMemo = new MemoizedCache<number>(perpBorrowAprCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  const client = getClientSolana({ commitment: 'processed' });

  const [borrowPositionPubkey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('borrow_lend'),
      jlpPoolPk.toBuffer(),
      new PublicKey(owner).toBuffer(),
      USDC_CUSTODY_PUBLIC_KEY.toBuffer(),
    ],
    perpsProgramId
  );

  const account = await getParsedAccountInfo(
    client,
    borrowPositionStruct,
    borrowPositionPubkey
  );

  if (!account) return [];

  const borrowApr = await borrowAprMemo.getItem(cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const element = elementRegistry.addElementBorrowlend({
    label: 'Lending',
    link: 'https://jup.ag/perps-loan',
    ref: account.pubkey,
    sourceRefs: [
      {
        name: 'Market',
        address: jlpPoolPk.toString(),
      },
    ],
  });

  element.addSuppliedAsset({
    address: jlpMint,
    amount: account.lockedCollateral,
  });

  element.addBorrowedAsset({
    address: usdcSolanaMint,
    amount: account.borrowSize.shiftedBy(-3),
  });

  if (borrowApr) {
    element.addSuppliedYield([yieldFromApy(0)]);
    element.addBorrowedYield([yieldFromApr(Number(borrowApr) / 100)]);
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-perpetual-borrow`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
