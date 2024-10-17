import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getDerivedAccount } from './helpers';
import driftDepositsFetcher from '../drift/depositsFetcher';
import kaminoLendDepositFetcher from '../kamino/lendsFetcher';
import mangoDepositFetcher from '../mango/collateralFetcher';
import { walletTokensPlatform } from '../tokens/constants';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getClientSolana } from '../../utils/clients';
import { userAccountStruct } from './struct';
import { obligationStruct } from '../save/structs';
import { mainMarket, marketsPrefix, reservesPrefix } from '../save/constants';
import { MarketInfo, ReserveInfo, ReserveInfoExtended } from '../save/types';
import { getElementsFromObligations } from '../save/helpers';
import { marginfiAccountStruct } from '../marginfi/structs/MarginfiAccount';
import { ParsedAccount } from '../../utils/solana';
import { BankInfo } from '../marginfi/types';
import { banksKey, platform } from '../marginfi/constants';
import { getElementFromAccount } from '../marginfi/helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const pda = getDerivedAccount(owner);

  const userAccount = await getParsedAccountInfo(
    client,
    userAccountStruct,
    new PublicKey(pda)
  );
  if (!userAccount) return [];

  const isSolendActivated =
    userAccount.solend_obligation.toString() !==
    '11111111111111111111111111111111';

  const isMarginFiActivated =
    userAccount.mfi_account.toString() !== '11111111111111111111111111111111';

  const portfolioElements: PortfolioElement[] = [];
  const [
    marginfiAccount,
    driftElements,
    kaminoElements,
    mangoElements,
    saveObligation,
  ] = await Promise.all([
    isMarginFiActivated
      ? getParsedAccountInfo(
          client,
          marginfiAccountStruct,
          userAccount.mfi_account
        )
      : undefined,
    driftDepositsFetcher.executor(pda, cache),
    kaminoLendDepositFetcher.executor(pda, cache),
    mangoDepositFetcher.executor(pda, cache),
    isSolendActivated
      ? getParsedAccountInfo(
          client,
          obligationStruct,
          userAccount.solend_obligation
        )
      : undefined,
  ]);

  portfolioElements.push(
    ...[...driftElements, ...kaminoElements, ...mangoElements]
  );

  if (saveObligation) {
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
        const reserveByAddress: Map<string, ReserveInfo> = new Map();
        reservesInfos.forEach((reserve) => {
          if (!reserve) return;

          reserveByAddress.set(reserve.pubkey, reserve);
        });

        const solendElements: PortfolioElement[] =
          await getElementsFromObligations(
            [saveObligation],
            reserveByAddress,
            new Map([[mainMarket, mainMarketInfo]]),
            owner,
            cache
          );
        portfolioElements.push(...solendElements);
      }
    }
  }

  if (marginfiAccount) {
    const banksInfo = await cache.getItem<ParsedAccount<BankInfo>[]>(banksKey, {
      prefix: platform.id,
      networkId: NetworkId.solana,
    });
    if (banksInfo) {
      const banksInfoByAddress: Map<string, BankInfo> = new Map();
      const tokensAddresses: Set<string> = new Set();
      banksInfo.forEach((bankInfo) => {
        if (!bankInfo) return;
        banksInfoByAddress.set(
          bankInfo.pubkey.toString(),
          bankInfo as BankInfo
        );
        tokensAddresses.add(bankInfo.mint.toString());
      });

      const tokenPriceById = await cache.getTokenPricesAsMap(
        Array.from(tokensAddresses),
        NetworkId.solana
      );

      const element = getElementFromAccount(
        marginfiAccount,
        banksInfoByAddress,
        tokenPriceById
      );
      if (element) portfolioElements.push(element);
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
