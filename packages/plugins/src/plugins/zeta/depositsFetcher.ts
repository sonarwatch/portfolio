import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId, usdcMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getCrossMarginAccounts } from './helpers';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { crossMarginAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const usdcTokenPrice = await cache.getTokenPrice(usdcMint, NetworkId.solana);
  if (!usdcTokenPrice) return [];

  let id = 0;
  const userAccounts = [];
  let parsedAccount;
  do {
    const accountPubKeys = getCrossMarginAccounts(
      programId,
      new PublicKey(owner),
      id,
      id + 3
    );
    parsedAccount = await getParsedMultipleAccountsInfo(
      client,
      crossMarginAccountStruct,
      accountPubKeys
    );
    userAccounts.push(...parsedAccount);
    id += 3;
  } while (parsedAccount[parsedAccount.length]);

  const elements: PortfolioElement[] = [];
  if (!userAccounts) return elements;

  for (const account of userAccounts) {
    if (!account) continue;
    if (account.balance.isZero()) continue;
    const asset: PortfolioAsset = tokenPriceToAssetToken(
      usdcMint,
      account.balance.dividedBy(10 ** usdcTokenPrice.decimals).toNumber(),
      NetworkId.solana,
      usdcTokenPrice
    );
    elements.push({
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      name: `N° ${account.subaccountIndex.toString()}`,
      type: PortfolioElementType.multiple,
      data: { assets: [asset] },
      value: asset.value,
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
