import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { basketProgramId, platformId, tokenListAddress } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { fundStruct, tokenListStruct } from './structs';
import { fundFilters } from './filters';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import getLpTokenSourceRaw, {
  PoolUnderlyingRaw,
} from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const tokenListRes = await getParsedAccountInfo(
    connection,
    tokenListStruct,
    tokenListAddress
  );
  if (!tokenListRes) return;
  const tokenList = tokenListRes.list
    .map((t) => t.tokenMint.toString())
    .slice(0, tokenListRes.numTokens.toNumber());
  const tokenPrices = await cache.getTokenPrices(tokenList, NetworkId.solana);

  const accounts = await getParsedProgramAccounts(
    connection,
    fundStruct,
    basketProgramId,
    fundFilters
  );

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    if (account.supplyOutstanding.isZero()) continue;

    const poolUnderlyingRaw: PoolUnderlyingRaw[] = [];
    for (let j = 0; j < account.numOfTokens.toNumber(); j++) {
      const tokenIndex = account.currentCompToken[j].toNumber();
      const tokenPrice = tokenPrices[tokenIndex];
      if (!tokenPrice) continue;
      poolUnderlyingRaw.push({
        address: tokenPrice.address,
        decimals: tokenPrice.decimals,
        price: tokenPrice.price,
        reserveAmountRaw: account.currentCompAmount[j],
      });
    }
    if (poolUnderlyingRaw.length === 0) continue;

    const lpSource = getLpTokenSourceRaw(
      NetworkId.solana,
      platformId,
      platformId,
      'Basket',
      {
        address: account.fundToken.toString(),
        decimals: 6,
        supplyRaw: account.supplyOutstanding,
      },
      poolUnderlyingRaw
    );
    await cache.setTokenPriceSource(lpSource);
  }
};
const job: Job = {
  id: `${platformId}-baskets`,
  executor,
  label: 'normal',
};
export default job;
