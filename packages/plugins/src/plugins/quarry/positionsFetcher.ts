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
  mineIdlItem,
  platform,
  platformId,
  rewardersCacheKey,
} from './constants';
import { platformId as thevaultPlatformId } from '../thevault/constants';
import { platformId as saberPlatformId } from '../saber/constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import { getQuarryData } from './helpers';
import { Miner, Rewarder } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const rewardersMemo = new MemoizedCache<Rewarder[]>(rewardersCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const rewarders = await rewardersMemo.getItem(cache);
  if (!rewarders) return [];

  const quarryDatas = getQuarryData(rewarders, new PublicKey(owner));

  const accounts = await getAutoParsedMultipleAccountsInfo<Miner>(
    connection,
    mineIdlItem,
    quarryDatas.map((m) => m.ownerMiner)
  ).then((accs) => accs.filter((acc) => acc !== null && acc.balance !== '0'));

  if (accounts.length === 0) return [];

  const mints = new Set<string>();

  accounts.forEach((account) => {
    const quarryData = quarryDatas.find(
      (q) => q.ownerMiner === account?.pubkey
    );
    if (!quarryData) return;
    const rewarder = rewarders.find(
      (r) => r.rewarder === quarryData.rewarder.toString()
    );
    if (!rewarder) return;

    mints.add(rewarder.rewardsTokenInfo.address);

    const quarry = rewarder.quarries.find((q) => account?.quarry === q.quarry);
    if (!quarry) return;
    mints.add(quarry.stakedToken.mint);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...mints],
    NetworkId.solana
  );

  const elements: PortfolioElement[] = [];

  accounts.forEach((account) => {
    if (!account) return;
    const quarryData = quarryDatas.find(
      (q) => q.ownerMiner === account?.pubkey
    );
    if (!quarryData) return;
    const rewarder = rewarders.find(
      (r) => r.rewarder === quarryData.rewarder.toString()
    );
    if (!rewarder) return;
    const quarry = rewarder.quarries.find((q) => account?.quarry === q.quarry);
    if (!quarry) return;

    const assets: PortfolioAssetToken[] = [];
    const rewardAssets: PortfolioAssetToken[] = [];

    const stakedTokenPrice = tokenPrices.get(quarry.stakedToken.mint);

    if (stakedTokenPrice)
      assets.push(
        ...tokenPriceToAssetTokens(
          stakedTokenPrice.address,
          new BigNumber(account.balance)
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
        name: quarry.primaryTokenInfo.symbol,
        data: {
          amount: new BigNumber(account.balance)
            .dividedBy(10 ** quarry.primaryTokenInfo.decimals)
            .toNumber(),
          address: quarry.stakedToken.mint,
          price: null,
        },
        imageUri: quarry.primaryTokenInfo.logoURI,
      });
    }

    const rewardTokenPrice = tokenPrices.get(rewarder.rewardsTokenInfo.address);
    if (account.rewardsEarned !== '0' && rewardTokenPrice) {
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

    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((a) => a.value));
    const value = assetsValue;

    let elementPlatformId;

    switch (rewarder.slug) {
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
        elementPlatformId === platformId ? rewarder.info?.name : platform.name,
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
