import { LeverageSide, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { pid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { positionStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await ParsedGpa.build(connection, positionStruct, pid)
    .addFilter('discriminator', [170, 188, 143, 228, 122, 64, 247, 208])
    .addFilter('trader', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const tokenPricesMap = await cache.getTokenPricesAsMap(
    accounts.map((acc) => acc.collateral.toString()),
    NetworkId.solana
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((position) => {
    const element = elementRegistry.addElementLeverage({
      label: 'Leverage',
      ref: position.pubkey,
    });

    const collatPrice = tokenPricesMap.get(position.collateral.toString());
    const principalPrice = tokenPricesMap.get(position.currency.toString());
    if (!collatPrice || !principalPrice) return;

    const collateralValue = position.collateralAmount.times(collatPrice.price);
    const principalValue = position.principal.times(principalPrice.price);

    const leverage = collateralValue
      .plus(principalValue)
      .dividedBy(collateralValue)
      .toNumber();

    element.addIsoPosition({
      collateralValue: collateralValue.toNumber(),
      address: position.collateral.toString(),
      entryPrice: 0, // missing
      leverage,
      markPrice: principalPrice.price,
      liquidationPrice: 0, // missing
      side: LeverageSide.long, // missing
      size: position.collateralAmount
        .dividedBy(10 ** collatPrice.decimals)
        .toNumber(),
      sizeValue: collateralValue.toNumber(),
      pnlValue: 0, // missing
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
