import {
  LeverageSide,
  NetworkId,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { pid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { positionStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { usdcSolanaMint } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await ParsedGpa.build(connection, positionStruct, pid)
    .addFilter('discriminator', [170, 188, 143, 228, 122, 64, 247, 208])
    .addFilter('trader', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const tokenPricesMap = await cache.getTokenPricesAsMap(
    [
      ...accounts.flatMap((acc) => [
        acc.collateral.toString(),
        acc.currency.toString(),
      ]),
      solanaNativeWrappedAddress,
    ],
    NetworkId.solana
  );

  const solTokenPrice = tokenPricesMap.get(solanaNativeWrappedAddress);
  if (!solTokenPrice) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const element = elementRegistry.addElementLeverage({
    label: 'Leverage',
  });
  accounts.forEach((position) => {
    const isLong =
      position.currency.toString() === usdcSolanaMint ||
      (position.currency.toString() === solanaNativeWrappedAddress &&
        position.collateral.toString() !== usdcSolanaMint);

    const collatPrice = tokenPricesMap.get(position.collateral.toString());
    const principalPrice = tokenPricesMap.get(position.currency.toString());
    if (!collatPrice || !principalPrice) return;

    const collateralValue = isLong
      ? position.downPayment
          .times(principalPrice.price)
          .dividedBy(10 ** principalPrice.decimals)
      : position.downPayment
          .times(collatPrice.price)
          .dividedBy(10 ** collatPrice.decimals);

    const isEntryPriceSolPrice =
      (isLong && position.currency.toString() === solanaNativeWrappedAddress) ||
      (!isLong &&
        position.collateral.toString() === solanaNativeWrappedAddress);

    const entryPriceRaw = isLong
      ? position.principal
          .plus(position.downPayment)
          .dividedBy(position.collateralAmount)
      : position.collateralAmount
          .minus(position.downPayment)
          .dividedBy(position.principal);

    const entryPrice = isEntryPriceSolPrice
      ? entryPriceRaw.times(solTokenPrice.price)
      : entryPriceRaw;

    const leverage = isLong
      ? position.principal.dividedBy(position.downPayment).plus(1)
      : position.collateralAmount.dividedBy(position.downPayment).minus(1);

    const interestOwed = new BigNumber(Date.now())
      .dividedBy(1000)
      .minus(position.lastFundingTimestamp)
      .times(0.3)
      .dividedBy(365 * 24 * 60 * 60);

    const rawPnl = isLong
      ? collatPrice.price - entryPrice.toNumber() - interestOwed.toNumber()
      : entryPrice.toNumber() - principalPrice.price + interestOwed.toNumber();

    const pnlValue = new BigNumber(rawPnl).times(leverage).toNumber();

    const side = isLong ? LeverageSide.long : LeverageSide.short;

    element.addIsoPosition({
      collateralValue: collateralValue.toNumber(),
      address: isLong
        ? position.collateral.toString()
        : position.currency.toString(),
      entryPrice: entryPrice.toNumber(),
      leverage: leverage.toNumber(),
      markPrice: isLong ? collatPrice.price : principalPrice.price,
      liquidationPrice: 0,
      side,
      size: position.collateralAmount
        .dividedBy(10 ** collatPrice.decimals)
        .toNumber(),
      sizeValue: collateralValue.toNumber(),
      pnlValue,
      ref: position.pubkey.toString(),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
