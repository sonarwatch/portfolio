import {
  NetworkId,
  solanaNativeAddress,
  solanaNativeDecimals,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  programId,
  solayerLstMint,
  solayerLstDecimals,
  solayerLstPool,
  solayerRstMint,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { restakingPoolStruct, stakePoolStruct } from './structs';
import { walletTokensPlatform } from '../tokens/constants';
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
    const lstSource = {
      address: solayerLstMint,
      decimals: solayerLstDecimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatform.id,
      price: solTokenPrice.price * ratio,
      timestamp: Date.now(),
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
    const rstSource = {
      ...lstSource,
      address: solayerRstMint,
      platformId,
      elementName: 'Restaking',
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
    await cache.setTokenPriceSources([lstSource, rstSource]);
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
    if (rstMint === solayerRstMint) return;

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
  executor,
  labels: ['normal'],
};
export default job;
