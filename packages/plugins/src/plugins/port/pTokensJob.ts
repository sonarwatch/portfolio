import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, portApi } from './constants';
import { ReservesResponse } from './types';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import { reservesKey } from '../kamino/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const reservesRes: AxiosResponse<ReservesResponse> | null = await axios
    .get(`${portApi}/reserves`)
    .catch(() => null);
  if (!reservesRes || reservesRes.data.length === 0) return;
  const reserves = reservesRes.data;

  const tokenPriceById = await getTokenPricesMap(
    reserves.map((r) => r.assetMintId),
    NetworkId.solana,
    cache
  );

  const promises = [];
  for (const reserve of reserves) {
    const { assetMintId } = reserve;

    const tokenPrice = tokenPriceById.get(assetMintId);
    if (!tokenPrice) continue;

    const exchangeRatio = new BigNumber(reserve.exchangeRatio);
    const amountPerLp = new BigNumber(1).dividedBy(exchangeRatio).toNumber();
    const price = exchangeRatio
      .dividedBy(10 ** tokenPrice.decimals)
      .times(tokenPrice.price)
      .toNumber();

    const pToken = reserve.shareMintId;

    promises.push(
      cache.setTokenPriceSource({
        address: reserve.reserveId,
        decimals: tokenPrice.decimals,
        id: pToken,
        networkId: NetworkId.solana,
        platformId,
        price,
        timestamp: Date.now(),
        weight: 1,
        underlyings: [
          {
            address: tokenPrice.address,
            amountPerLp,
            decimals: tokenPrice.decimals,
            networkId: NetworkId.solana,
            price: tokenPrice.price,
          },
        ],
      })
    );
  }
  promises.push(
    cache.setItem(reservesKey, reserves, {
      prefix: platformId,
      networkId: NetworkId.solana,
    })
  );
  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-pTokens`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
