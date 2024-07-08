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
  jlpMint,
  leverageFiProgramID,
  nxfinanceLeverageIdlItem,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { CollateralDetail, MarginAccount, MarginPool } from './types';

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

  let jlpDeposit: CollateralDetail | undefined;

  // MULTIPLE ELEMENT FOR "LEND" TAB, ALL DEPOSITS EXCEPT JLP
  const assets: PortfolioAsset[] = [];
  marginAccount.deposits.forEach((deposit) => {
    if (deposit.tokenMint === jlpMint) {
      jlpDeposit = deposit;
      return;
    }
    const tokenPrice = tokenPrices.get(
      formatTokenAddress(deposit.tokenMint, NetworkId.solana)
    );
    if (!tokenPrice) return;
    const marginPool = marginPools.find(
      (mp) => mp?.tokenMint === deposit.tokenMint
    );
    if (!marginPool) return;

    /*
    const borrowAPR = 0.2278; // TODO GET LAST VALUE
    const preTime = Number(marginPool.accruedUntil);
    const borrowTokens = new BigNumber(marginPool.borrowedTokens);

    const m = new BigNumber(borrowAPR)
      .multipliedBy(new Date().getTime() / 1000 - preTime)
      .dividedBy(31536e3)
      .multipliedBy(borrowTokens);

    const supplyNoteRate = new BigNumber(marginPool.depositTokens)
      .plus(m)
      .dividedBy(marginPool.depositNotes);
*/

    const supplyNoteRate = 1.02;

    const amount = new BigNumber(deposit.depositNote)
      .multipliedBy(supplyNoteRate)
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();

    if (amount > 0)
      assets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          amount,
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

  // LEVERAGE ELEMENT FOR "LEVERAGE" TAB
  if (jlpDeposit) {
    const jlpTokenPrice = tokenPrices.get(
      formatTokenAddress(jlpDeposit.tokenMint, NetworkId.solana)
    );
    if (jlpTokenPrice) {
      const borrowedAssets: PortfolioAsset[] = [];
      const borrowedYields: Yield[][] = [];
      const suppliedAssets: PortfolioAsset[] = [];
      const suppliedYields: Yield[][] = [];
      const rewardAssets: PortfolioAsset[] = [];

      suppliedAssets.push(
        tokenPriceToAssetToken(
          jlpTokenPrice.address,
          new BigNumber(jlpDeposit.depositToken)
            .dividedBy(10 ** jlpTokenPrice.decimals)
            .toNumber(),
          NetworkId.solana,
          jlpTokenPrice
        )
      );

      marginAccount.loans.forEach((loan) => {
        const tokenPrice = tokenPrices.get(
          formatTokenAddress(loan.tokenMint, NetworkId.solana)
        );
        if (!tokenPrice) return;
        borrowedAssets.push(
          tokenPriceToAssetToken(
            tokenPrice.address,
            new BigNumber(loan.loanToken)
              .dividedBy(10 ** tokenPrice.decimals)
              .toNumber(),
            NetworkId.solana,
            tokenPrice
          )
        );
      });

      if (suppliedAssets.length !== 0 || borrowedAssets.length !== 0) {
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
    }
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
