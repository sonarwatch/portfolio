import {
  NetworkId,
  TokenPrice,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import {
  dataSizeFilter,
  dataStructSizeFilter,
} from '../../utils/solana/filters';
import { dlmmProgramId, platformId } from './constants';
import { binArrayBitmapExtensionStruct, lbPairStruct } from './struct';
import { getBinArrayForSwap, getSwapQuote } from './dlmmHelper';
import { defaultAcceptedPairs } from '../../utils/misc/getLpUnderlyingTokenSource';
import { getDecimalsForToken } from '../../utils/misc/getCachedDecimalsForToken';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const [lbPairs, bitmapExtensions] = await Promise.all([
    getParsedProgramAccounts(client, lbPairStruct, dlmmProgramId, [
      ...dataSizeFilter(904),
      {
        memcmp: {
          offset: 82,
          bytes: '1',
        },
      },
    ]),
    getParsedProgramAccounts(
      client,
      binArrayBitmapExtensionStruct,
      dlmmProgramId,
      dataStructSizeFilter(binArrayBitmapExtensionStruct)
    ),
  ]);
  const solanaAcceptedPairs = defaultAcceptedPairs.get(NetworkId.solana);
  if (!solanaAcceptedPairs) return;

  const step = 1;
  const sources: TokenPriceSource[] = [];

  for (let n = 0; n < lbPairs.length; n += step) {
    const slice = lbPairs.slice(n, (n += step));

    const tokenPriceById = await cache.getTokenPricesAsMap(
      slice
        .map((lb) => [lb.tokenXMint.toString(), lb.tokenYMint.toString()])
        .flat(),
      NetworkId.solana
    );
    console.log(
      'constexecutor:JobExecutor= ~ tokenPrices:',
      tokenPriceById.keys.length
    );

    lbPairs.forEach(async (lbPair) => {
      const bitmapExtension = bitmapExtensions.find(
        (ext) => ext.lbPair.toString() === lbPair.pubkey.toString()
      );
      const amountIn = new BigNumber(1);
      const binArray = await getBinArrayForSwap(lbPair, bitmapExtension);

      let direction: boolean;
      let tokenPriceIn: TokenPrice | undefined;
      let tokenOutMint: string;
      console.log(
        'lbPairs.forEach ~ lbPair.tokenXMint.toString():',
        lbPair.tokenXMint.toString()
      );
      if (solanaAcceptedPairs.includes(lbPair.tokenXMint.toString())) {
        console.log('tokenXMint');
        direction = false;
        tokenPriceIn = tokenPriceById.get(lbPair.tokenXMint.toString());
        tokenOutMint = lbPair.tokenYMint.toString();
      } else if (solanaAcceptedPairs.includes(lbPair.tokenYMint.toString())) {
        console.log('tokenYMint');
        direction = true;
        tokenPriceIn = tokenPriceById.get(lbPair.tokenYMint.toString());
        tokenOutMint = lbPair.tokenXMint.toString();
      } else {
        console.log('no mint');
        return;
      }

      const amountOut = getSwapQuote(
        amountIn,
        direction,
        new BigNumber(1),
        lbPair,
        binArray,
        bitmapExtension
      );
      if (!amountOut || !tokenPriceIn) return;

      const newTokenPrice = new BigNumber(tokenPriceIn.price)
        .dividedBy(amountOut)
        .toNumber();

      const decimals = await getDecimalsForToken(
        tokenOutMint,
        NetworkId.solana
      );
      if (!decimals) return;

      const source = {
        id: lbPair.pubkey.toString(),
        decimals: decimals.valueOf(),
        address: tokenOutMint,
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: newTokenPrice,
        timestamp: Date.now(),
        weight: 0.1,
      };
      console.log('lbPairs.forEach ~ source:', source);
      sources.push(source);
    });
  }

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-dlmms`,
  executor,
  label: 'normal',
};
export default job;
