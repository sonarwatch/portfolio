import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { CLOBMarketAccount } from './structs';
import { CLOBMarket, CLOBVersion } from './types';
import { dataStructSizeFilter } from '../../../utils/solana/filters';

const networkId = NetworkId.solana;

export default function getMarketJobExecutor(
  clobVersion: CLOBVersion
): JobExecutor {
  return async (cache: Cache) => {
    const client = getClientSolana();
    const marketsAccounts = await getParsedProgramAccounts(
      client,
      clobVersion.struct,
      new PublicKey(clobVersion.programId),
      dataStructSizeFilter(clobVersion.struct)
    );

    await addMarketsToCache(cache, clobVersion, marketsAccounts);
  };
}

async function addMarketsToCache(
  cache: Cache,
  clobVersion: CLOBVersion,
  marketsAccounts: CLOBMarketAccount[]
) {
  for (let i = 0; i < marketsAccounts.length; i++) {
    const marketAccount = marketsAccounts[i];
    const marketData = getCLOBMarket(
      marketAccount,
      clobVersion.programId.toString()
    );
    if (!marketData) continue;

    await cache.setItem(marketAccount.ownAddress.toString(), marketData, {
      prefix: clobVersion.prefix,
      networkId,
    });
  }
}

function getCLOBMarket(
  account: CLOBMarketAccount,
  programId: string
): CLOBMarket | undefined {
  if (account.baseDepositsTotal.isZero() && account.baseDepositsTotal.isZero())
    return undefined;

  return {
    address: account.ownAddress.toString(),
    baseMint: account.baseMint.toString(),
    baseDepositsTotal: account.baseDepositsTotal,
    quoteMint: account.quoteMint.toString(),
    quoteDepositsTotal: account.quoteDepositsTotal,
    programId,
  };
}
