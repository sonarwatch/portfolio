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
      .run()
      .then((accounts) =>
        accounts.filter((acc) => acc.closeTimestamp.isZero())
      ),
    ParsedGpa.build(connection, positionStruct, solPid)
      .addFilter('discriminator', [170, 188, 143, 228, 122, 64, 247, 208])
      .addDataSizeFilter(178)
      .addFilter('trader', new PublicKey(owner))
      .run()
      .then((accounts) =>
        accounts.filter((acc) => acc.closeTimestamp.isZero())
      ),
  ]);

  const positions = [...usdcPositions, ...solPositions];

  if (!positions.length) return [];

  const pools = await cache.getItems<CachedPool>(
    positions.map((p) => p.pool.toString()),
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

  positions.forEach((acc, index) => {
    const pool = pools.find((p) =>
      p ? p.pubkey.toString() === acc.pool.toString() : false
    );
    if (!pool) return;

    const assetPrice = priceById.get(pool.collateralType.toString());
    if (!assetPrice) return;
    const timeReference = !acc.lastInterestCollect.isZero()
      ? acc.lastInterestCollect
      : acc.timestamp;
    const daysSinceStart = Math.floor(
      (Date.now() / 1000 - timeReference.toNumber()) / (60 * 60 * 24)
    );

    // Seems like they mixed up the collateral and size
    const size = acc.collateralAmount.dividedBy(amountFactor);
    const collatAmount = acc.userPaid.dividedBy(amountFactor);
    const amount = acc.amount.dividedBy(amountFactor);

    const collatPrice =
      index <= usdcPositions.length ? usdcPrice.price : solPrice.price;
    const collatSizeValue = size.times(collatPrice);

    const collateralValue = collatAmount.times(collatPrice);
    const sizeValue = size.times(assetPrice.price);
    const dailyInterest = acc.interestRate / 365;
    const entryPrice = amount.plus(collatAmount).dividedBy(size);
    const interest = amount
      .times(dailyInterest / 100)
      .times(daysSinceStart + 1);

    const liquidationPrice = amount
      .plus(interest)
      .dividedBy(collatSizeValue.times(0.9))
      .toNumber();
    const pnlValue = new BigNumber(assetPrice.price)
      .minus(entryPrice)
      .times(size)
      .minus(interest)
      .toNumber();
    element.addIsoPosition({
      collateralValue: collateralValue.toNumber(),
      address: assetPrice.address,
      entryPrice: entryPrice.toNumber(),
      leverage: acc.amount
        .plus(acc.userPaid)
        .dividedBy(acc.userPaid)
        .toNumber(),
      markPrice: assetPrice.price,
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
