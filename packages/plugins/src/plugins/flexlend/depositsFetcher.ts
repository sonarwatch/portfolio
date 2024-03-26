import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getDerivedAccount } from './helpers';
import driftDepositsFetcher from '../drift/deposits';
import kaminoLendDepositFetcher from '../kamino/lendsFetcher';
import mangoDepositFetcher from '../mango/collateralFetcher';
import { fetchers as marginfiDepositsFetchers } from '../marginfi/index';
import { walletTokensPlatform } from '../tokens/constants';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getClientSolana } from '../../utils/clients';
import { userAccountStruct } from './struct';
import { obligationStruct } from '../solend/structs';
import { mainMarket, marketsPrefix, reservesPrefix } from '../solend/constants';
import { MarketInfo, ReserveInfo, ReserveInfoExtended } from '../solend/types';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { getElementsFromObligations } from '../solend/helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const pda = getDerivedAccount(owner);

  const userAccount = await getParsedAccountInfo(
    client,
    userAccountStruct,
    new PublicKey(pda)
  );
  if (!userAccount) return [];

  const portfolioElements: PortfolioElement[] = [];
  const [
    marginElements,
    driftElements,
    kaminoElements,
    mangoElements,
    solendObligation,
  ] = await Promise.all([
    marginfiDepositsFetchers[0].executor(pda, cache),
    driftDepositsFetcher.executor(pda, cache),
    kaminoLendDepositFetcher.executor(pda, cache),
    mangoDepositFetcher.executor(pda, cache),
    getParsedAccountInfo(
      client,
      obligationStruct,
      userAccount.solend_obligation
    ),
  ]);

  portfolioElements.push(
    ...[
      ...marginElements,
      ...driftElements,
      ...kaminoElements,
      ...mangoElements,
    ]
  );

  if (solendObligation) {
    const mainMarketInfo = await cache.getItem<MarketInfo>(mainMarket, {
      prefix: marketsPrefix,
      networkId: NetworkId.solana,
    });
    if (mainMarketInfo) {
      const reserveAddresses: Set<string> = new Set();

      mainMarketInfo.reserves.forEach((reserve) => {
        reserveAddresses.add(reserve.address);
      });
      const reservesInfos = await cache.getItems<ReserveInfoExtended>(
        Array.from(reserveAddresses),
        {
          prefix: reservesPrefix,
          networkId: NetworkId.solana,
        }
      );
      if (reservesInfos.length !== 0) {
        const mints: string[] = [];
        const pythAddresses: PublicKey[] = [];
        const reserveByAddress: Map<string, ReserveInfo> = new Map();
        reservesInfos.forEach((reserve) => {
          if (!reserve) return;

          pythAddresses.push(
            new PublicKey(reserve.reserve.liquidity.pythOracle)
          );
          mints.push(reserve.reserve.liquidity.mintPubkey);
          reserveByAddress.set(reserve.pubkey, reserve);
        });

        const [pythAccounts, tokenPriceByAddress] = await Promise.all([
          getMultipleAccountsInfoSafe(client, pythAddresses),
          cache.getTokenPricesAsMap(mints, NetworkId.solana),
        ]);

        const pythAccByAddress: Map<string, AccountInfo<Buffer>> = new Map();
        for (let i = 0; i < pythAddresses.length; i++) {
          const account = pythAccounts[i];
          if (account === null) continue;

          pythAccByAddress.set(pythAddresses[i].toString(), account);
        }

        const solendElements: PortfolioElement[] = getElementsFromObligations(
          [solendObligation],
          reserveByAddress,
          new Map([[mainMarket, mainMarketInfo]]),
          tokenPriceByAddress,
          pythAccByAddress
        );
        portfolioElements.push(...solendElements);
      }
    }
  }

  if (portfolioElements.length === 0) return [];

  const elements: PortfolioElement[] = [];
  for (const element of portfolioElements) {
    const tmpElement = element;
    tmpElement.name =
      tmpElement.platformId === walletTokensPlatform.id
        ? 'Tokens/Rewards'
        : tmpElement.platformId.slice(0, 1).toUpperCase() +
          tmpElement.platformId.slice(1);
    tmpElement.platformId = platformId;
    elements.push({
      ...tmpElement,
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
