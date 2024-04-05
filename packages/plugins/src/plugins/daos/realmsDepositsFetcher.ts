import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../utils/solana';
import { voteStruct, voterStruct } from './structs/realms';
import { voteAccountFilters } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getLockedUntil, getVoterPda } from './helpers';
import { RealmData } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const realmData = await cache.getItem<RealmData>('data', {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  if (!realmData) return [];

  const splGovPrograms = realmData.govPrograms;
  const registrarById: Map<string, string> = new Map();
  const mintsSet: Set<string> = new Set();

  const voterAccountsPubKeys: PublicKey[] = [];
  realmData.registrars.forEach((registrarInfo) => {
    voterAccountsPubKeys.push(
      getVoterPda(owner, registrarInfo.pubkey, registrarInfo.vsr)
    );
    mintsSet.add(registrarInfo.mint);
    registrarById.set(registrarInfo.pubkey, registrarInfo.mint);
  });

  const tempVoterAccounts = await getParsedMultipleAccountsInfo(
    client,
    voterStruct,
    voterAccountsPubKeys
  );

  const getAccountSplGovPromises = [];
  if (splGovPrograms) {
    for (const program of splGovPrograms) {
      getAccountSplGovPromises.push(
        getParsedProgramAccounts(
          client,
          voteStruct,
          new PublicKey(program),
          voteAccountFilters(owner)
        )
      );
    }
  }
  const splGovAccounts = (await Promise.all(getAccountSplGovPromises)).flat();

  const voterAccounts = tempVoterAccounts;
  if (tempVoterAccounts.length === 0 && splGovAccounts.length === 0) return [];

  splGovAccounts.forEach((account) => mintsSet.add(account.mint.toString()));

  const mints = Array.from(mintsSet);

  const tokenPrices = await cache.getTokenPrices(mints, NetworkId.solana);
  if (!tokenPrices) return [];

  const tokenPriceByMint: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tP) => (tP ? tokenPriceByMint.set(tP.address, tP) : []));

  const realmsAssets: PortfolioAsset[] = [];
  for (const voteAccount of splGovAccounts) {
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
    realmsAssets.push(asset);
  }

  for (const voterAccount of voterAccounts) {
    if (!voterAccount) continue;
    const registrar = registrarById.get(voterAccount.registrar.toString());
    if (!registrar) continue;

    const mint = registrar;
    const tP = tokenPriceByMint.get(mint);
    if (!tP) continue;
    for (const deposit of voterAccount.deposits) {
      if (!deposit.amountDepositedNative.isZero()) {
        const asset = tokenPriceToAssetToken(
          mint,
          deposit.amountDepositedNative.dividedBy(10 ** tP.decimals).toNumber(),
          NetworkId.solana,
          tP
        );
        const lockedUntil = getLockedUntil(
          deposit.lockup.startTs,
          deposit.lockup.endTs,
          deposit.lockup.kind
        );

        realmsAssets.push(
          lockedUntil ? { ...asset, attributes: { lockedUntil } } : asset
        );
      }
    }
  }

  const elements: PortfolioElement[] = [];
  if (realmsAssets.length > 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId,
      type: 'multiple',
      label: 'Deposit',
      value: getUsdValueSum(realmsAssets.map((a) => a.value)),
      data: {
        assets: realmsAssets,
      },
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
