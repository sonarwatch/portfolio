import {
  NetworkId,
  solanaNativeAddress,
  solanaNativeDecimals,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  programId,
  solayerLstPool,
  stakePoolMint,
  stakePoolDecimals,
  solayerLstMint,
  solayerLstDecimals,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { restakingPoolStruct, stakePoolStruct } from './structs';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  // Solayer LST pricing
  const solTokenPrice = await cache.getTokenPrice(
    solanaNativeAddress,
    NetworkId.solana
  );
  const stakePool = await getParsedAccountInfo(
    connection,
    stakePoolStruct,
    new PublicKey(solayerLstPool)
  );
  if (solTokenPrice && stakePool) {
    const ratio = stakePool.totalLamports
      .div(stakePool.poolTokenSupply)
      .toNumber();
    const stakePoolSource = {
      address: stakePoolMint,
      decimals: stakePoolDecimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatformId,
      price: solTokenPrice.price * ratio,
      timestamp: Date.now(),
      elementName: 'Restaking',
      weight: 1,
      underlyings: [
        {
          address: solanaNativeAddress,
          amountPerLp: ratio,
          decimals: solanaNativeDecimals,
          networkId: NetworkId.solana,
          price: solTokenPrice.price,
        },
      ],
    };
    const lstSource = {
      ...stakePoolSource,
      address: solayerLstMint,
      decimals: solayerLstDecimals,
      platformId: walletTokensPlatformId,
    };
    await cache.setTokenPriceSources([stakePoolSource, lstSource]);
  }

  // Solayer restaking pools
  const accounts = await getParsedProgramAccounts(
    connection,
    restakingPoolStruct,
    programId,
    [
      {
        dataSize: restakingPoolStruct.byteSize,
      },
    ]
  );
  const prices = await cache.getTokenPricesAsMap(
    accounts.map((a) => a.lstMint.toString()),
    NetworkId.solana
  );
  const sources: TokenPriceSource[] = [];
  accounts.forEach((acc) => {
    const rstMint = acc.rstMint.toString();
    const lstMint = acc.lstMint.toString();

    // Ignore Solayer custom RST, already supported above
    if (rstMint === solayerLstMint) return;

    const tp = prices.get(lstMint);
    if (!tp) return;
    sources.push({
      address: rstMint,
      decimals: tp.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price: tp.price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Restaking',
      underlyings: [
        {
          address: lstMint,
          decimals: tp.decimals,
          amountPerLp: 1,
          networkId: NetworkId.solana,
          price: tp.price,
        },
      ],
    });
  });
  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
