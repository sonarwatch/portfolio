import {
  LeverageSide,
  NetworkId,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { usdcPid, platformId, solPid } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { positionStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { CachedPool } from './types';
import { usdcSolanaMint } from '../../utils/solana';

const amountFactor = 10 ** 6;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const [usdcPositions, solPositions] = await Promise.all([
    ParsedGpa.build(connection, positionStruct, usdcPid)
      .addFilter('discriminator', [170, 188, 143, 228, 122, 64, 247, 208])
      .addDataSizeFilter(178)
      .addFilter('trader', new PublicKey(owner))
      .run(),
    ParsedGpa.build(connection, positionStruct, solPid)
      .addFilter('discriminator', [170, 188, 143, 228, 122, 64, 247, 208])
      .addDataSizeFilter(178)
      .addFilter('trader', new PublicKey(owner))
      .run(),
  ]);

  if (!usdcPositions && !solPositions) return [];

  const pools = await cache.getItems<CachedPool>(
    [...usdcPositions, ...solPositions].map((p) => p.pool.toString()),
    { prefix: platformId, networkId: NetworkId.solana }
  );
  if (!pools) throw new Error('Pools not in cache');

  const priceById = await cache.getTokenPricesAsMap(
    [
      ...pools.map((p) => (p ? p.collateralType.toString() : [])).flat(),
      usdcSolanaMint,
      solanaNativeWrappedAddress,
    ],
    NetworkId.solana
  );

  const usdcPrice = priceById.get(usdcSolanaMint);
  const solPrice = priceById.get(solanaNativeWrappedAddress);
  if (!usdcPrice || !solPrice)
    throw new Error('USDC or SOL price not in cache');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementLeverage({ label: 'Leverage' });

  [...usdcPositions, ...solPositions].forEach((acc, index) => {
    const pool = pools.find((p) =>
      p ? p.pubkey.toString() === acc.pool.toString() : false
    );
    if (!pool) return;

    const collatPrice = priceById.get(pool.collateralType.toString());
    if (!collatPrice) return;
    const timeReference = !acc.lastInterestCollect.isZero()
      ? acc.lastInterestCollect
      : acc.timestamp;
    const daysSinceStart = Math.floor(
      (Date.now() / 1000 - timeReference.toNumber()) / (60 * 60 * 24)
    );
    const collatAmount = acc.collateralAmount.dividedBy(amountFactor);
    const size = acc.amount.plus(acc.userPaid).dividedBy(amountFactor);
    const collateralValue = collatAmount.times(collatPrice.price);
    const sizeValue = size.times(
      index <= usdcPositions.length ? usdcPrice.price : solPrice.price
    );
    const dailyInterest = acc.interestRate / 365;
    const amount = acc.amount.dividedBy(amountFactor);
    const entryPrice = size.dividedBy(collatAmount);
    const interest = amount
      .times(dailyInterest / 100)
      .times(daysSinceStart + 1);

    const liquidationPrice = amount
      .plus(interest)
      .dividedBy(collateralValue.times(0.9))
      .toNumber();
    const pnlValue = new BigNumber(collatPrice.price)
      .minus(entryPrice)
      .times(collatAmount)
      .minus(interest)
      .toNumber();
    element.addIsoPosition({
      collateralValue: collateralValue.toNumber(),
      address: collatPrice.address,
      entryPrice: entryPrice.toNumber(),
      leverage: acc.amount
        .plus(acc.userPaid)
        .dividedBy(acc.userPaid)
        .toNumber(),
      markPrice: collatPrice.price,
      liquidationPrice,
      side: LeverageSide.long,
      size: size.toNumber(),
      sizeValue: sizeValue.toNumber(),
      pnlValue,
      ref: acc.pubkey.toString(),
      sourceRefs: [
        {
          address: pool.pubkey,
          name: 'Pool',
        },
      ],
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
