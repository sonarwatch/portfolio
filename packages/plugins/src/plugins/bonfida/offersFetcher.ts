import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { offerPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { categoryOfferStruct, offerStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [categoryOfferAccounts, offerAccounts] = await Promise.all([
    getParsedProgramAccounts(connection, categoryOfferStruct, offerPid, [
      { memcmp: { offset: 0, bytes: 'C' } },
      {
        memcmp: {
          bytes: owner,
          offset: 50,
        },
      },
    ]),
    getParsedProgramAccounts(connection, offerStruct, offerPid, [
      { memcmp: { offset: 0, bytes: '2' } },
      {
        memcmp: {
          bytes: owner,
          offset: 34,
        },
      },
    ]),
  ]);

  if (!offerAccounts && categoryOfferAccounts) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...offerAccounts.map((a) => a.mint.toString()), solanaNativeAddress],
    NetworkId.solana
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const offerElement = registry.addElementMultiple({
    label: 'Deposit',
    link: `https://www.sns.id/profile?pubkey=${owner}&tab=offers`,
  });

  [
    ...offerAccounts,
    ...categoryOfferAccounts.map((a) => ({ ...a, mint: solanaNativeAddress })),
  ].forEach((acc) => {
    if (acc.amount.isZero()) return;
    const tokenPrice = tokenPrices.get(acc.mint.toString());
    if (!tokenPrice) return;

    offerElement.addAsset({
      address: acc.mint.toString(),
      amount: acc.amount,
      ref: acc.pubkey.toString(),
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-offers`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
