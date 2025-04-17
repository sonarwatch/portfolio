import {
  NetworkId,
  parseTypeString,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  houseType,
  platformId,
  redeemTicketsKey,
  redeemType,
  unihouse,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { House, RedeemRequest, RedeemTicket } from './types';
import { getDecimals } from '../../utils/sui/getDecimals';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { oneDay } from '../drift-market-maker-vault/depositsFetcher';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const objects = await getDynamicFields(client, unihouse);

  // House to price the LP tokens (gTokens)
  const housesDynFields = objects.filter((obj) =>
    obj.objectType.includes(houseType)
  );

  // RedeemRequest to show pending withdraw to users
  const redeemDynFields = objects.filter((obj) =>
    obj.objectType.includes(redeemType)
  );

  const [housesObjects, redeemRequestsObjects] = await Promise.all([
    multiGetObjects<House>(
      client,
      housesDynFields.map((obj) => obj.objectId)
    ),
    multiGetObjects<RedeemRequest>(
      client,
      redeemDynFields.map((obj) => obj.objectId)
    ),
  ]);

  const mints: string[] = [];
  housesObjects.forEach((house) => {
    if (house.data?.type) {
      const { keys } = parseTypeString(house.data.type);
      if (keys) {
        const { type } = keys[0];
        if (type) mints.push(type);
      }
    }
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(mints, NetworkId.sui);

  const tokenPriceSources: TokenPriceSource[] = [];
  for (const houseObj of housesObjects) {
    if (!houseObj.data || !houseObj.data.content?.fields) continue;

    const houseFields = houseObj.data.content.fields;

    let mint;
    let tokenTicker;
    const { keys } = parseTypeString(houseObj.data.type);
    if (keys) {
      const { type, struct } = keys[0];
      if (type) mint = type;
      tokenTicker = struct;
    }
    if (!mint) continue;

    const tokenPrice = tokenPriceById.get(mint);
    if (!tokenPrice) continue;

    const decimals = await getDecimals(client, mint);
    if (decimals === null) continue;

    const ratio = BigNumber(houseFields.pool)
      .plus(houseFields.pipe_debt.fields.value)
      .dividedBy(houseFields.supply.fields.value);

    const lpMint = parseTypeString(houseFields.supply.type).keys?.at(0)?.type;
    if (!lpMint) continue;

    tokenPriceSources.push({
      address: lpMint,
      decimals,
      id: houseObj.data.objectId,
      networkId: NetworkId.sui,
      platformId,
      price: ratio.times(tokenPrice.price).toNumber(),
      underlyings: [
        {
          address: tokenPrice.address,
          amountPerLp: ratio.toNumber(),
          decimals: tokenPrice.decimals,
          networkId: tokenPrice.networkId,
          price: tokenPrice.price,
        },
      ],
      timestamp: Date.now(),
      weight: 1,
      liquidityName: tokenTicker ? `g${tokenTicker}` : undefined,
    });
  }

  const redeemTickets: RedeemTicket[] = [];

  for (const redeemReq of redeemRequestsObjects) {
    if (!redeemReq.data || !redeemReq.data.content) continue;

    const lockUntil = BigNumber(redeemReq.data.content.fields.created_at)
      .plus(oneDay)
      .toNumber();

    const amount = redeemReq.data.content.fields.s_coin.fields.balance;

    const mint = parseTypeString(
      redeemReq.data.content.fields.s_coin.type
    ).keys?.at(0)?.type;

    if (!mint) continue;

    redeemTickets.push({
      owner: redeemReq.data.content.fields.sender,
      amount,
      mint,
      lockUntil,
    });
  }

  await cache.setItem(redeemTicketsKey, redeemTickets, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  await cache.setTokenPriceSources(tokenPriceSources);
};
const job: Job = {
  id: `${platformId}-houses`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
