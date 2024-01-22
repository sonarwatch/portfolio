import {
  NetworkId,
  PortfolioAsset,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { vsrInfos, platformId, splGovProgramsKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { voteAccountStruct, voterStruct } from './structs';
import { voteAccountFilters, voterAccountFilters } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const programs = await cache.getItem<string[]>(splGovProgramsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!programs) return [];

  const promises = [];
  for (const program of programs) {
    promises.push(
      getParsedProgramAccounts(
        client,
        voteAccountStruct,
        new PublicKey(program),
        voteAccountFilters(owner)
      )
    );
  }

  const vsrMints = [];
  const vsrAmountsByMints: Map<string, BigNumber> = new Map();
  for (const vsrInfo of vsrInfos) {
    const voterAccounts = await getParsedProgramAccounts(
      client,
      voterStruct,
      vsrInfo.programId,
      voterAccountFilters(owner)
    );
    if (voterAccounts.length > 0) {
      vsrMints.push(vsrInfo.mint);
      const deposits = voterAccounts
        .map((account) =>
          account.deposits.map((deposit) => deposit.amountDepositedNative)
        )
        .flat();
      const depositsAmount = deposits.reduce((sum: BigNumber, currValue) =>
        sum.plus(currValue)
      );
      const oldValue = vsrAmountsByMints.get(vsrInfo.mint);
      if (!oldValue) {
        vsrAmountsByMints.set(vsrInfo.mint, depositsAmount);
      } else {
        vsrAmountsByMints.set(vsrInfo.mint, depositsAmount.plus(oldValue));
      }
    }
  }

  const oldVoteAccounts = (await Promise.all(promises)).flat();

  if (oldVoteAccounts.length === 0) return [];

  const mints = oldVoteAccounts.map((acc) => acc.mint.toString());

  const tokenPrices = await cache.getTokenPrices(
    [...mints, ...vsrMints],
    NetworkId.solana
  );
  if (!tokenPrices) return [];

  const tokenPriceByMint: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tP) => (tP ? tokenPriceByMint.set(tP.address, tP) : []));

  const assets: PortfolioAsset[] = [];
  for (const voteAccount of oldVoteAccounts) {
    if (voteAccount.amount.isZero()) continue;
    const tokenMint = voteAccount.mint.toString();
    const tokenPrice = tokenPriceByMint.get(tokenMint);
    if (!tokenPrice) continue;

    const amount = voteAccount.amount.div(10 ** tokenPrice.decimals).toNumber();

    const asset = tokenPriceToAssetToken(
      tokenMint,
      amount,
      NetworkId.solana,
      tokenPrice
    );
    assets.push(asset);
  }

  vsrAmountsByMints.forEach((amount, mint) => {
    const tokenPrice = tokenPriceByMint.get(mint);
    if (tokenPrice) {
      assets.push(
        tokenPriceToAssetToken(
          mint,
          amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
          NetworkId.solana,
          tokenPrice
        )
      );
    }
  });

  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: 'multiple',
      label: 'Deposit',
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
