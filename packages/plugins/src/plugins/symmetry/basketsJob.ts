/* eslint-disable no-labels */
import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { basketProgramId, platformId, tokenListAddress } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { OracleType, fundStruct, tokenListStruct } from './structs';
import { fundFilters } from './filters';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getSymbol } from './helpers';
import getLpTokenSourceRaw, {
  PoolUnderlyingRaw,
} from '../../utils/misc/getLpTokenSourceRaw';
import { getPythTokenPriceSources } from '../../utils/solana/pyth/helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const tokenListRes = await getParsedAccountInfo(
    connection,
    tokenListStruct,
    tokenListAddress
  );
  if (!tokenListRes) return;
  const tokenSettings = [...tokenListRes.list].slice(
    0,
    tokenListRes.numTokens.toNumber()
  );

  // Add tokens prices from Pyth Oracles
  const pythSources = await getPythTokenPriceSources(
    connection,
    tokenSettings
      .filter((ts) => ts.oracleType === OracleType.Pyth)
      .map((ts) => ({
        mint: ts.tokenMint,
        oracle: ts.oracleAccount,
      }))
  );
  await cache.setTokenPriceSources(pythSources);

  const tokenPrices = await cache.getTokenPrices(
    tokenSettings.map((ts) => ts.tokenMint.toString()),
    NetworkId.solana
  );
  const accounts = await getParsedProgramAccounts(
    connection,
    fundStruct,
    basketProgramId,
    fundFilters
  );

  const lpSources: TokenPriceSource[] = [];
  mainLoop: for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    if (account.supplyOutstanding.isZero()) continue;

    const poolUnderlyingRaw: PoolUnderlyingRaw[] = [];
    for (let j = 0; j < account.numOfTokens.toNumber(); j++) {
      const tokenIndex = account.currentCompToken[j].toNumber();
      const tokenPrice = tokenPrices[tokenIndex];
      if (!tokenPrice) continue mainLoop;
      const reserveAmountRaw = account.currentCompAmount[j];
      if (reserveAmountRaw.isZero()) continue;
      poolUnderlyingRaw.push({
        address: tokenPrice.address,
        decimals: tokenPrice.decimals,
        price: tokenPrice.price,
        reserveAmountRaw,
      });
    }
    if (poolUnderlyingRaw.length === 0) continue;

    const lpSource = getLpTokenSourceRaw(
      NetworkId.solana,
      platformId,
      platformId,
      {
        address: account.fundToken.toString(),
        decimals: 6,
        supplyRaw: account.supplyOutstanding,
      },
      poolUnderlyingRaw,
      'Basket',
      getSymbol(account)
    );
    lpSources.push(lpSource);
  }
  await cache.setTokenPriceSources(lpSources);
};
const job: Job = {
  id: `${platformId}-baskets`,
  executor,
  label: 'normal',
};
export default job;
