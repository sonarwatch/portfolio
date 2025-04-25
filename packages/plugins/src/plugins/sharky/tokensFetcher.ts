import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  cachePrefix,
  platformId,
  sharkyProgram,
  tokensOrderBooksCacheKey,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  tokenLendingLoanStruct,
  TokenLendingOrderBook,
  tokenLendingPoolStruct,
} from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { PortfolioAssetTokenParams } from '../../utils/elementbuilder/Params';

const orderbooksMemo = new MemoizedCache<
  ParsedAccount<TokenLendingOrderBook>[],
  Map<string, TokenLendingOrderBook>
>(
  tokensOrderBooksCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pubkey')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [tokenLendingPoolAccounts, loansAsBorrower] = await Promise.all([
    ParsedGpa.build(connection, tokenLendingPoolStruct, sharkyProgram)
      .addFilter('accountDiscriminator', [33, 59, 13, 135, 153, 105, 127, 146])
      .addFilter('lender', new PublicKey(owner))
      .run(),
    ParsedGpa.build(connection, tokenLendingLoanStruct, sharkyProgram)
      .addFilter('accountDiscriminator', [48, 250, 133, 85, 42, 11, 45, 154])
      .addFilter('borrower', new PublicKey(owner))
      .run(),
  ]);

  if (tokenLendingPoolAccounts.length === 0 && loansAsBorrower.length === 0)
    return [];

  const loansAsLender = (
    await Promise.all(
      tokenLendingPoolAccounts.map((pool) =>
        ParsedGpa.build(connection, tokenLendingLoanStruct, sharkyProgram)
          .addFilter(
            'accountDiscriminator',
            [48, 250, 133, 85, 42, 11, 45, 154]
          )
          .addFilter('pool', pool.pubkey)
          .run()
      )
    )
  ).flat();

  const orderbooks = await orderbooksMemo.getItem(cache);
  if (!orderbooks) throw new Error('Token Orderbooks not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  tokenLendingPoolAccounts.forEach((account) => {
    const orderbook = orderbooks.get(account.orderbook.toString());
    if (!orderbook) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Offer',
      ref: account.pubkey.toString(),
      link: 'https://sharky.fi/token/offers',
      sourceRefs: [
        {
          name: 'Pool',
          address: account.orderbook.toString(),
        },
      ],
    });

    element.addSuppliedAsset({
      address: orderbook.loan_mint,
      amount: account.available_usdc_liquidity,
    });
  });

  [...loansAsLender, ...loansAsBorrower].forEach((account) => {
    const orderbook = orderbooks.get(account.orderbook.toString());
    if (!orderbook) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Loan',
      ref: account.pubkey.toString(),
      link: 'https://sharky.fi/token/loans',
      sourceRefs: [
        {
          name: 'Pool',
          address: account.orderbook.toString(),
        },
      ],
    });

    const isLender = account.borrower.toString() !== owner;

    const principal: PortfolioAssetTokenParams = {
      address: orderbook.loan_mint,
      amount: account.principal_usdc_amount,
    };
    const collateral: PortfolioAssetTokenParams = {
      address: orderbook.collateral_mint,
      amount: account.collateral_required_amount,
    };

    if (isLender) {
      element.addSuppliedAsset(principal);
      element.addBorrowedAsset(collateral);
    } else {
      element.addSuppliedAsset(collateral);
      element.addBorrowedAsset(principal);
    }

    element.setFixedTerms(
      isLender,
      new BigNumber(account.end_ts).multipliedBy(1000).toNumber()
    );
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-tokens`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
