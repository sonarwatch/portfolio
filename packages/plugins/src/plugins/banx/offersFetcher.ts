import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { usdcSolanaMint } from '../../utils/solana';
import {
  banxPid,
  banxSolMint,
  nftMarketsMemo,
  platformId,
  splMarketsMemo,
} from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { BondOfferBondingCurveType, bondOfferv3Struct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = (
    await ParsedGpa.build(connection, bondOfferv3Struct, banxPid)
      .addFilter('accountDiscriminator', [54, 96, 254, 195, 217, 91, 187, 104])
      .addFilter('assetReceiver', new PublicKey(owner))
      .run()
  ).filter((acc) => !acc.buyOrdersQuantity.isZero());

  if (accounts.length === 0) return [];

  const [splMarkets, nftMarkets] = await Promise.all([
    splMarketsMemo.getItem(cache),
    nftMarketsMemo.getItem(cache),
  ]);

  if (!splMarkets) throw new Error('SPL Markets not cached');
  if (!nftMarkets) throw new Error('NFT Markets not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const splMarket = splMarkets.get(account.hadoMarket.toString());
    const nftMarket = nftMarkets.get(account.hadoMarket.toString());
    if (!splMarket && !nftMarket) {
      return;
    }

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: account.pubkey,
      sourceRefs: [
        {
          name: 'Market',
          address: account.hadoMarket.toString(),
        },
      ],
    });

    let address;
    switch (account.bondingCurve.bondingType) {
      case BondOfferBondingCurveType.Linearusdc:
      case BondOfferBondingCurveType.Exponentialusdc:
        address = usdcSolanaMint;
        break;
      case BondOfferBondingCurveType.Linearbanxsol:
      case BondOfferBondingCurveType.Exponentialbanxsol:
        address = banxSolMint;
        break;
      case BondOfferBondingCurveType.Linear:
      case BondOfferBondingCurveType.Exponential:
      default:
        address = solanaNativeAddress;
        break;
    }

    element.addSuppliedAsset({
      address,
      amount: account.fundsSolOrTokenBalance,
    });

    let name = `${
      Number(account.buyOrdersQuantity) > 1
        ? `${account.buyOrdersQuantity} `
        : ''
    }Lend Offer${Number(account.buyOrdersQuantity) > 1 ? 's' : ''}`;

    if (splMarket) {
      name = `${name} on ${splMarket.collateral.ticker}`;
    } else if (nftMarket) {
      name = `${name} on ${nftMarket.collectionName}`;
    }

    element.setName(name);
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-offers`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
