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
    const collatPrice = tokenPricesMap.get(position.collateral.toString());
    const principalPrice = tokenPricesMap.get(position.currency.toString());
    if (!collatPrice || !principalPrice) return;

    const isLong =
      position.currency.toString() === usdcSolanaMint ||
      (position.currency.toString() === solanaNativeWrappedAddress &&
        position.collateral.toString() !== usdcSolanaMint);

    const isEntryPriceSolPrice =
      (isLong && position.currency.toString() === solanaNativeWrappedAddress) ||
      (!isLong &&
        position.collateral.toString() === solanaNativeWrappedAddress);

    const interestOwed = new BigNumber(Date.now())
      .dividedBy(1000)
      .minus(position.lastFundingTimestamp)
      .times(0.3)
      .dividedBy(365 * 24 * 60 * 60);

    const usdValue = position.collateralAmount
      .dividedBy(10 ** collatPrice.decimals)
      .times(collatPrice.price)
      .minus(
        position.principal
          .dividedBy(10 ** principalPrice.decimals)
          .plus(interestOwed)
          .times(principalPrice.price)
      )
      .minus(position.feesToBePaid.dividedBy(10 ** principalPrice.decimals));

    const pnlValue = usdValue.minus(position.downPayment.dividedBy(10 ** 6));

    let collateralValue;
    let entryPrice;
    let markPrice;
    let leverage;
    let size;
    let side;
    let sizeValue;
    let liquidationPrice;
    let address;

    if (isLong) {
      address = position.collateral.toString();
      collateralValue = position.downPayment
        .times(principalPrice.price)
        .dividedBy(10 ** principalPrice.decimals);

      size = position.collateralAmount.dividedBy(10 ** collatPrice.decimals);
      sizeValue = size.times(collatPrice.price).toNumber();

      const entryPriceRaw = position.principal
        .plus(position.downPayment)
        .dividedBy(position.collateralAmount);

      entryPrice = isEntryPriceSolPrice
        ? entryPriceRaw.times(solTokenPrice.price)
        : entryPriceRaw;

      markPrice = collatPrice.price;

      liquidationPrice = position.principal
        .times(1.05)
        .dividedBy(position.collateralAmount);

      leverage = position.principal.dividedBy(position.downPayment).plus(1);

      side = LeverageSide.long;
    } else {
      address = position.currency.toString();
      collateralValue = position.downPayment
        .times(collatPrice.price)
        .dividedBy(10 ** collatPrice.decimals);

      size = position.principal.dividedBy(10 ** principalPrice.decimals);
      sizeValue = size.times(principalPrice.price).toNumber();

      const entryPriceRaw = position.collateralAmount
        .minus(position.downPayment)
        .dividedBy(position.principal);

      entryPrice = isEntryPriceSolPrice
        ? entryPriceRaw.times(solTokenPrice.price)
        : entryPriceRaw;

      markPrice = principalPrice.price;

      liquidationPrice = position.collateralAmount
        .minus(0.95)
        .dividedBy(position.principal.plus(interestOwed));

      leverage = position.collateralAmount
        .dividedBy(position.downPayment)
        .minus(1);

      side = LeverageSide.short;
    }

    element.addIsoPosition({
      collateralValue: collateralValue.toNumber(),
      address,
      entryPrice: entryPrice.toNumber(),
      leverage: leverage.toNumber(),
      markPrice,
      liquidationPrice: liquidationPrice.toNumber(),
      side,
      size: size.toNumber(),
      sizeValue,
      pnlValue: pnlValue.toNumber(),
      ref: position.pubkey.toString(),
      value: usdValue.toNumber(),
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
