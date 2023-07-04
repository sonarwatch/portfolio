import {
  Context,
  FetcherExecutor,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';
import { getParsedProgramAccounts } from '../utils/solana';
import { marinadeTicketProgramId, platformId, solFactor } from './constants';
import { ticketStruct } from './structs';
import { ticketFilters } from './filters';

const fetcherExecutor: FetcherExecutor = async (
  owner: string,
  context: Context
) => {
  const connection = new Connection('');
  const tickets = await getParsedProgramAccounts(
    connection,
    ticketStruct,
    marinadeTicketProgramId,
    ticketFilters(owner)
  );
  if (tickets.length === 0) return [];

  const assets: PortfolioAsset[] = [];
  const { tokenPriceCache } = context;
  for (let i = 0; i < tickets.length; i += 1) {
    const ticket = tickets[i];
    const amount = ticket.lamportsAmount.div(solFactor).toNumber();
    const tokenPrice = await tokenPriceCache.get(
      solanaNativeAddress,
      NetworkId.solana
    );
    const price = tokenPrice ? tokenPrice.price : null;
    const value = price ? price * amount : null;

    const asset: PortfolioAssetToken = {
      type: PortfolioAssetType.token,
      networkId: NetworkId.solana,
      value,
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
    value: null,
    data: {
      assets,
    },
  };
  return [element];
};
export default fetcherExecutor;
