import {
  getUsdValueSum,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  mergeMineIdlItem,
  mineIdlItem,
  platform,
  platformId,
  rewardersCacheKey,
} from './constants';
import { platformId as thevaultPlatformId } from '../thevault/constants';
import { platformId as saberPlatformId } from '../saber/constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getAutoParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import { getQuarryPDAs, isMinerAccount } from './helpers';
import { MergeMiner, Miner, Position, Rewarder } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { mergeMinerFilters, minerFilters } from './filters';

const rewardersMemo = new MemoizedCache<Rewarder[]>(rewardersCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = (
    await Promise.all([
      getAutoParsedProgramAccounts<Miner>(
        connection,
        mineIdlItem,
        minerFilters(owner)
      ).then(
        (accs) =>
          accs.filter(
            (acc) => acc !== null && acc.balance !== '0'
          ) as ParsedAccount<Miner>[]
      ),
      getAutoParsedProgramAccounts<MergeMiner>(
        connection,
        mergeMineIdlItem,
        mergeMinerFilters(owner)
      ).then(
        (accs) =>
          accs.filter(
            (acc) => acc !== null && acc.primaryBalance !== '0'
          ) as ParsedAccount<MergeMiner>[]
      ),
    ])
  ).flat();

  if (accounts.length === 0) return [];

  const allRewarders = await rewardersMemo.getItem(cache);
  if (!allRewarders) return [];

  const quarryPDAS = getQuarryPDAs(allRewarders, new PublicKey(owner));

  const mints = new Set<string>();

  const positions: Position[] = [];

  accounts.forEach((account) => {
    if (!account) return;

    const quarryPDA = quarryPDAS.find((q) =>
      isMinerAccount(account)
        ? q.ownerMiner.toString() === account.pubkey.toString()
        : q.mm.toString() === account.pubkey.toString()
    );
    if (!quarryPDA) return;

    const rewarders: Rewarder[] = [
      quarryPDA.rewarder.toString(),
      ...quarryPDA.replicas.map((r) => r.rewarder.toString()),
    ]
      .map((rpk) => allRewarders.find((r) => r.rewarder === rpk))
      .filter((r) => r !== null) as Rewarder[];

    if (rewarders.length === 0) return;

    const primaryRewarder = rewarders[0];

    const primaryQuarry = primaryRewarder.quarries.find(
      (q) => quarryPDA.primaryQuarry.toString() === q.quarry
    );
    if (!primaryQuarry) return;

    const rewardsToken = [
      quarryPDA.rewardsToken.toString(),
      ...quarryPDA.replicas.map((r) => r.rewardsMint.toString()),
    ];

    const stakedToken = primaryQuarry.primaryTokenInfo.address;
    mints.add(stakedToken);
    rewardsToken.forEach((rewardToken) => mints.add(rewardToken.toString()));

    positions.push({
      account,
      rewarders,
      rewardsToken,
      stakedBalance: isMinerAccount(account)
        ? account.balance
        : account.primaryBalance,
      stakedTokenInfo: primaryQuarry.primaryTokenInfo,
    });
  });
  if (positions.length === 0) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...mints],
    NetworkId.solana
  );

  const elements: PortfolioElement[] = [];

  positions.forEach((position) => {
    const { account, rewardsToken, rewarders, stakedBalance, stakedTokenInfo } =
      position;

    const primaryRewarder = rewarders[0];

    if (!account) return;

    const assets: PortfolioAssetToken[] = [];
    const rewardAssets: PortfolioAssetToken[] = [];

    const stakedTokenPrice = tokenPrices.get(stakedTokenInfo.address);

    if (stakedTokenPrice)
      assets.push(
        ...tokenPriceToAssetTokens(
          stakedTokenPrice.address,
          new BigNumber(stakedBalance)
            .dividedBy(10 ** stakedTokenPrice.decimals)
            .toNumber(),
          NetworkId.solana,
          stakedTokenPrice
        )
      );
    else {
      assets.push({
        networkId: NetworkId.solana,
        type: 'token',
        value: null,
        attributes: {},
        name: stakedTokenInfo.symbol,
        data: {
          amount: new BigNumber(stakedBalance)
            .dividedBy(10 ** stakedTokenInfo.decimals)
            .toNumber(),
          address: stakedTokenInfo.address,
          price: null,
        },
        imageUri: stakedTokenInfo.logoURI,
      });
    }

    rewardsToken.forEach((rewardToken: string, i: number) => {
      // mergeMiner are not supported
      if (i > 0 || !isMinerAccount(account)) return;

      if (!account?.rewardsEarned) return;

      const rewardTokenPrice = tokenPrices.get(rewardToken);

      if (rewardTokenPrice) {
        rewardAssets.push(
          tokenPriceToAssetToken(
            rewardTokenPrice.address,
            new BigNumber(account.rewardsEarned)
              .dividedBy(10 ** rewardTokenPrice.decimals)
              .toNumber(),
            NetworkId.solana,
            rewardTokenPrice
          )
        );
      }
    });

    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((a) => a.value));
    const value = assetsValue;

    let elementPlatformId;

    switch (primaryRewarder.slug) {
      case 'vault':
        elementPlatformId = thevaultPlatformId;
        break;
      case 'saber':
        elementPlatformId = saberPlatformId;
        break;
      default:
        elementPlatformId = platformId;
    }

    elements.push({
      networkId: NetworkId.solana,
      label: 'Deposit',
      platformId: elementPlatformId,
      type: PortfolioElementType.liquidity,
      value,
      name:
        elementPlatformId === platformId
          ? primaryRewarder.info?.name
          : platform.name,
      data: {
        liquidities: [
          {
            assets,
            assetsValue,
            rewardAssets,
            rewardAssetsValue,
            value,
            yields: [],
          },
        ],
      },
    });
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
