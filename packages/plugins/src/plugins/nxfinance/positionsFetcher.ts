import {
  NetworkId,
  PortfolioElementType,
  PortfolioElement,
  PortfolioAsset,
  Yield,
  formatTokenAddress,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  ID,
  leverageFiProgramID,
  nxfinanceLeverageIdlItem,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { MarginAccount } from './types';

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

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const mints = new Set<string>();
  marginAccount.deposits.forEach((d) =>
    mints.add(formatTokenAddress(d.tokenMint, NetworkId.solana))
  );
  marginAccount.loans.forEach((l) =>
    mints.add(formatTokenAddress(l.tokenMint, NetworkId.solana))
  );

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...mints],
    NetworkId.solana
  );

  marginAccount.deposits.forEach((deposit) => {
    const tokenPrice = tokenPrices.get(
      formatTokenAddress(deposit.tokenMint, NetworkId.solana)
    );
    if (!tokenPrice) return;
    suppliedAssets.push(
      tokenPriceToAssetToken(
        tokenPrice.address,
        new BigNumber(deposit.depositToken)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.solana,
        tokenPrice
      )
    );
  });

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
    const { borrowedValue, suppliedValue, value, rewardValue } =
      getElementLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
      });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
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
        value,
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
