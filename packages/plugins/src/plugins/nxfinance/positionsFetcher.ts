import {
  formatTokenAddress,
  getElementLendingValues,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  ID,
  leverageFiProgramID,
  leverageVaultsMints,
  nxfinanceLeverageIdlItem,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { MarginAccount, MarginPool } from './types';
import { getBorrowNoteRate, getSupplyNoteRate } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const marginAccountPublicKey = PublicKey.findProgramAddressSync(
    [
      PublicKey.findProgramAddressSync(
        [ID.toBuffer()],
        leverageFiProgramID
      )[0].toBuffer(),
      new PublicKey(owner).toBuffer(),
      Buffer.from('account'),
    ],
    leverageFiProgramID
  )[0];

  const marginAccount = (
    await getAutoParsedMultipleAccountsInfo<MarginAccount>(
      connection,
      nxfinanceLeverageIdlItem,
      [marginAccountPublicKey]
    )
  )[0];

  if (!marginAccount) return [];

  const elements: PortfolioElement[] = [];

  const mints = new Set<string>();
  marginAccount.deposits.forEach((d) =>
    mints.add(formatTokenAddress(d.tokenMint, NetworkId.solana))
  );
  marginAccount.loans.forEach((l) =>
    mints.add(formatTokenAddress(l.tokenMint, NetworkId.solana))
  );

  const marginPoolsPublicKeys = [...mints].map(
    (mint) =>
      PublicKey.findProgramAddressSync(
        [
          PublicKey.findProgramAddressSync(
            [ID.toBuffer()],
            leverageFiProgramID
          )[0].toBuffer(),
          new PublicKey(mint).toBuffer(),
        ],
        leverageFiProgramID
      )[0]
  );

  const [tokenPrices, marginPools] = await Promise.all([
    cache.getTokenPricesAsMap([...mints], NetworkId.solana),
    getAutoParsedMultipleAccountsInfo<MarginPool>(
      connection,
      nxfinanceLeverageIdlItem,
      marginPoolsPublicKeys
    ),
  ]);

  // assets for Lend
  const assets: PortfolioAsset[] = [];

  // assets for Leverage
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  marginAccount.deposits.forEach((deposit) => {
    const tokenPrice = tokenPrices.get(
      formatTokenAddress(deposit.tokenMint, NetworkId.solana)
    );
    if (!tokenPrice) return;
    const marginPool = marginPools.find(
      (mp) => mp?.tokenMint === deposit.tokenMint
    );
    if (!marginPool) return;

    const supplyNoteRate = getSupplyNoteRate(marginPool);

    const amount = new BigNumber(deposit.depositNote)
      .multipliedBy(supplyNoteRate)
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();

    if (amount > 0) {
      const assetToken = tokenPriceToAssetToken(
        tokenPrice.address,
        amount,
        NetworkId.solana,
        tokenPrice
      );
      if (leverageVaultsMints.includes(deposit.tokenMint)) {
        suppliedAssets.push(assetToken);
      } else {
        assets.push(assetToken);
      }
    }
  });

  marginAccount.loans.forEach((loan) => {
    const tokenPrice = tokenPrices.get(
      formatTokenAddress(loan.tokenMint, NetworkId.solana)
    );
    if (!tokenPrice) return;
    const marginPool = marginPools.find(
      (mp) => mp?.tokenMint === loan.tokenMint
    );
    if (!marginPool) return;

    const borrowNoteRate = getBorrowNoteRate(marginPool);
    borrowedAssets.push(
      tokenPriceToAssetToken(
        tokenPrice.address,
        new BigNumber(loan.loanNote)
          .multipliedBy(borrowNoteRate)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.solana,
        tokenPrice
      )
    );
  });

  if (assets.length > 0)
    elements.push({
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      name: 'Jupiter Lending Pool',
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      data: {
        assets,
      },
    });

  if (suppliedAssets.length > 0 || borrowedAssets.length > 0) {
    const { borrowedValue, suppliedValue, rewardValue } =
      getElementLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
      });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Leverage',
      name: `JLP Leverage x${new BigNumber(marginAccount.leverage)
        .dividedBy(100)
        .decimalPlaces(2)}`,
      value: suppliedValue,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        rewardAssets,
        rewardValue,
        healthRatio: null,
        value: suppliedValue,
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
