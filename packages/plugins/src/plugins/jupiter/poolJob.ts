import {
  NetworkId,
  TokenPrice,
  getTokenPricesUnderlyingsFromTokensPrices,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
} from '../../utils/solana';
import { jlpPool, jlpToken, platformId } from './constants';
import { custodyStruct, perpetualPoolStruct } from './structs/perpetuals';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const poolAccount = (
    await getParsedMultipleAccountsInfo(client, perpetualPoolStruct, [jlpPool])
  )[0];
  if (!poolAccount) return;

  const custodiesAccounts = await getParsedMultipleAccountsInfo(
    client,
    custodyStruct,
    poolAccount.custodies
  );

  const mints: string[] = [];
  const tokensAccountsAddresses: PublicKey[] = [];
  custodiesAccounts.forEach((acc) => {
    if (acc) {
      mints.push(acc.mint.toString());
      tokensAccountsAddresses.push(acc.tokenAccount);
    }
  });
  if (poolAccount.custodies.length !== mints.length) return;

  const tokensPricesRaw = await cache.getTokenPrices(mints, NetworkId.solana);

  const tokensPrices: TokenPrice[] = [];
  tokensPricesRaw.forEach((tP) => (tP ? tokensPrices.push(tP) : []));
  if (tokensPrices.length !== mints.length) return;

  const tokensAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    tokensAccountsAddresses
  );

  const tokensAmounts = tokensAccounts
    .map((tA, i) =>
      tA ? tA.amount.dividedBy(10 ** tokensPrices[i].decimals) : []
    )
    .flat();

  const lpTokenSupply = await client.getTokenSupply(jlpToken);

  const lpAmount = new BigNumber(lpTokenSupply.value.amount).dividedBy(
    10 ** lpTokenSupply.value.decimals
  );

  const price = poolAccount.aumUsd.dividedBy(10 ** 6).dividedBy(lpAmount);

  const underlyingsAmounts = tokensAmounts
    .map((amount) => amount.dividedBy(lpAmount))
    .flat();

  const basePrice = tokensAmounts
    .map((amount, i) => amount.multipliedBy(tokensPrices[i].price))
    .reduce((sum, current) => current.plus(sum), new BigNumber(0))
    .dividedBy(lpAmount);

  const factor = price.dividedBy(basePrice);

  const underlyings = getTokenPricesUnderlyingsFromTokensPrices(
    tokensPrices,
    underlyingsAmounts.map((a) => a.multipliedBy(factor).toNumber())
  );
  await cache.setTokenPriceSource({
    address: jlpToken.toString(),
    decimals: 6,
    id: platformId,
    networkId: NetworkId.solana,
    elementName: 'JLP Pool',
    platformId,
    price: price.toNumber(),
    timestamp: Date.now(),
    weight: 1,
    underlyings,
  });
};

const job: Job = {
  id: `${platformId}-pool`,
  executor,
  label: 'normal',
};
export default job;
