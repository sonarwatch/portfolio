import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';

import { dataSizeStructFilter } from './filters';
import { CLOBMarketAccount } from './structs';
import { CLOBMarket, CLOBProgramInfo } from './types';

const networkId = NetworkId.solana;

export default function getMarketJobExecutor(
  clobProgramInfo: CLOBProgramInfo
): JobExecutor {
  return async (cache: Cache) => {
    const client = getClientSolana();
    const marketsAccounts = await getParsedProgramAccounts(
      client,
      clobProgramInfo.struct,
      new PublicKey(clobProgramInfo.programId),
      dataSizeStructFilter(clobProgramInfo.struct)
    );

    await addMarketsToCache(cache, clobProgramInfo, marketsAccounts);
  };
}

async function addMarketsToCache(
  cache: Cache,
  clobProgramInfo: CLOBProgramInfo,
  marketsAccounts: CLOBMarketAccount[]
) {
  for (let i = 0; i < marketsAccounts.length; i++) {
    const marketAccount = marketsAccounts[i];
    const marketData = getCLOBMarket(
      marketAccount,
      clobProgramInfo.programId.toString()
    );
    if (!marketData) continue;

    await cache.setItem(marketAccount.ownAddress.toString(), marketData, {
      prefix: clobProgramInfo.prefix,
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
