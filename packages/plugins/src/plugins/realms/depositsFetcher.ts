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
import {
  customVsrInfo,
  platformId,
  splGovProgramsKey,
  vsrProgram,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../utils/solana';
import {
  Registrar,
  registrarStruct,
  voteStruct,
  voterStruct,
} from './structs/realms';
import { voteAccountFilters, voterAccountFilters } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getLockedUntil } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const splGovPrograms = await cache.getItem<string[]>(splGovProgramsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

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

  const getAccountsCustomVoterPromises = [];
  for (const vsrInfo of customVsrInfo) {
    getAccountsCustomVoterPromises.push(
      getParsedProgramAccounts(
        client,
        voterStruct,
        vsrInfo.programId,
        voterAccountFilters(owner)
      )
    );
  }
  const customVoterAccounts = (
    await Promise.all(getAccountsCustomVoterPromises)
  ).flat();

  const realmVoterAccounts = await getParsedProgramAccounts(
    client,
    voterStruct,
    vsrProgram,
    voterAccountFilters(owner)
  );

  const voterAccounts = [...realmVoterAccounts, ...customVoterAccounts];
  if (voterAccounts.length === 0 && splGovAccounts.length === 0) return [];

  const registrarAddresses: Set<PublicKey> = new Set();
  voterAccounts.forEach((account) => registrarAddresses.add(account.registrar));
  const registrars =
    registrarAddresses.size > 0
      ? await getParsedMultipleAccountsInfo(
          client,
          registrarStruct,
          Array.from(registrarAddresses)
        )
      : [];
  const registrarById: Map<string, ParsedAccount<Registrar>> = new Map();
  const mintsSet: Set<string> = new Set();
  for (const registrar of registrars) {
    if (!registrar) continue;
    mintsSet.add(registrar.realmGoverningTokenMint.toString());
    registrarById.set(registrar.pubkey.toString(), registrar);
  }
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
    const registrar = registrarById.get(voterAccount.registrar.toString());
    if (!registrar) continue;

    const mint = registrar.realmGoverningTokenMint.toString();
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
