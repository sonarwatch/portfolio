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
import { mineIdlItem, platformId, rewardersCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import { getQuarryData } from './helpers';
import { Miner, Rewarder } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

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

    assets.push({
      ...tokenPriceToAssetToken(
        stakedTokenPrice?.address || quarry.stakedToken.mint,
        new BigNumber(account.balance)
          .dividedBy(
            10 ** (stakedTokenPrice?.decimals || quarry.stakedToken.decimals)
          )
          .toNumber(),
        NetworkId.solana,
        stakedTokenPrice
      ),
      name: quarry.primaryTokenInfo.symbol,
    });

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

    elements.push({
      networkId: NetworkId.solana,
      label: 'Deposit',
      platformId,
      type: PortfolioElementType.liquidity,
      value,
      name: rewarder.info?.name,
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
