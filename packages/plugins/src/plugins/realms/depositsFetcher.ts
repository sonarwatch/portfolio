import {
  NetworkId,
  PortfolioAsset,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { vsrInfos, platformId, splGovProgramsKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { LockupKind, voteAccountStruct, voterStruct } from './structs';
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

  const oldVoteAccounts = (await Promise.all(promises)).flat();

  const mints = [
    ...oldVoteAccounts.map((acc) => acc.mint.toString()),
    ...vsrInfos.map((info) => info.mint),
  ];

  const tokenPrices = await cache.getTokenPrices(mints, NetworkId.solana);
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

  for (const vsrInfo of vsrInfos) {
    const voterAccounts = await getParsedProgramAccounts(
      client,
      voterStruct,
      vsrInfo.programId,
      voterAccountFilters(owner)
    );
    const { mint } = vsrInfo;
    const tokenPrice = tokenPriceByMint.get(mint);
    if (!tokenPrice) continue;

    for (const account of voterAccounts) {
      for (const deposit of account.deposits) {
        if (!deposit.amountDepositedNative.isZero()) {
          const asset = tokenPriceToAssetToken(
            mint,
            deposit.amountDepositedNative
              .dividedBy(10 ** tokenPrice.decimals)
              .toNumber(),
            NetworkId.solana,
            tokenPrice
          );
          let lockedUntil;
          if (deposit.lockup.kind === LockupKind.Constant) {
            lockedUntil = deposit.lockup.endTs
              .minus(deposit.lockup.startTs)
              .times(1000)
              .plus(Date.now())
              .toNumber();
          } else if (
            deposit.lockup.kind === LockupKind.Cliff ||
            deposit.lockup.kind === LockupKind.Monthly ||
            deposit.lockup.kind === LockupKind.Daily
          ) {
            lockedUntil = deposit.lockup.endTs.times(1000).toNumber();
          }
          assets.push(
            lockedUntil ? { ...asset, attributes: { lockedUntil } } : asset
          );
        }
      }
    }
  }

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
