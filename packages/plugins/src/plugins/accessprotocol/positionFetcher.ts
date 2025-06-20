import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import {
  acsDecimals,
  acsMint,
  cachePrefix,
  platformId,
  stakePid,
  stakingPoolsCacheKey,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { StakeAccount, stakeAccountStruct } from './structs';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { stakeAccountStructFilter } from './filters';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { getStakeAccountPda } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const accounts: ParsedAccount<StakeAccount>[] = await getStakeAccounts(
    owner,
    cache
  );
  const acsTokenPrice = await cache.getTokenPrice(acsMint, NetworkId.solana);
  const assets: PortfolioAsset[] = accounts
    .filter((acc) => !acc.stakeAmount.isZero())
    .map((account) => ({
      ...tokenPriceToAssetToken(
        acsMint,
        account.stakeAmount.dividedBy(10 ** acsDecimals).toNumber(),
        NetworkId.solana,
        acsTokenPrice
      ),
      attributes: {},
      link: `https://hub.accessprotocol.co/en/creators/${account.stakePool.toString()}`,
      ref: account.pubkey.toString(),
    }));

  if (assets.length === 0) return [];
  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

export async function getStakeAccounts(owner: string, cache: Cache) {
  const client = getClientSolana();

  const stakingPools = await cache.getItem<PublicKey[]>(stakingPoolsCacheKey, {
    prefix: cachePrefix,
    networkId: NetworkId.solana
  });

  if (!stakingPools || stakingPools.length === 0) {
    console.warn(`[${platformId}] Fallback to on-chain fetch for owner ${owner}`);
    return getParsedProgramAccounts(
      client,
      stakeAccountStruct,
      stakePid,
      stakeAccountStructFilter(owner)
    );
  }

  const ownerPublicKey = new PublicKey(owner);
  const pdas: PublicKey[] = [];
  for (const pool of stakingPools) {
    const poolPubkey = typeof pool === 'string' ? new PublicKey(pool) : pool;
    const stakeAccountPda = getStakeAccountPda(ownerPublicKey, poolPubkey);
    pdas.push(stakeAccountPda);
  }

  const uniquePdas = Array.from(new Set(pdas.map((p) => p.toBase58()))).map((s) => new PublicKey(s));
  const allAccountInfos: (AccountInfo<Buffer> | null)[] =
    await getMultipleAccountsInfoSafe(getClientSolana(), uniquePdas);

  return allAccountInfos
    .map((info, idx) => {
      if (!info) return null;
      try {
        const [parsed] = stakeAccountStruct.deserialize(info.data);
        return {
          ...parsed,
          pubkey: uniquePdas[idx],
          lamports: info.lamports
        } as ParsedAccount<StakeAccount>;
      } catch (e) {
        console.warn(`Failed to parse PDA: ${uniquePdas[idx].toBase58()}`);
        return null;
      }
    })
    .filter((x): x is ParsedAccount<StakeAccount> => x !== null);
}

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor
};

export default fetcher;
