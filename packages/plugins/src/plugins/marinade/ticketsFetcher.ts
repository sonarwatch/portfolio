import {
  NetworkId,
  PortfolioAsset,
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  getUsdValueSumStrict,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { getParsedProgramAccounts } from '../../utils/solana';
import { marinadeTicketProgramId, platformId, solFactor } from './constants';
import { ticketStruct } from './structs';
import { ticketFilters } from './filters';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const tickets = await getParsedProgramAccounts(
    connection,
    ticketStruct,
    marinadeTicketProgramId,
    ticketFilters(owner)
  );
  if (tickets.length === 0) return [];

  const assets: PortfolioAsset[] = [];
  for (let i = 0; i < tickets.length; i += 1) {
    const ticket = tickets[i];
    const amount = ticket.lamportsAmount.div(solFactor).toNumber();
    const tokenPrice = await cache.getTokenPrice(
      solanaNativeAddress,
      NetworkId.solana
    );
    const price = tokenPrice ? tokenPrice.price : null;
    const value = price ? price * amount : null;

    const asset: PortfolioAssetToken = {
      type: PortfolioAssetType.token,
      networkId: NetworkId.solana,
      value,
      attributes: {},
      data: {
        address: solanaNativeAddress,
        price,
        amount,
      },
    };
    assets.push(asset);
  }
  if (assets.length === 0) return [];

  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.solana,
    platformId,
    label: 'Rewards',
    value: getUsdValueSumStrict(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-tickets`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
