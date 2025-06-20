import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { lendingPoolsCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getLendingPoolBalance, getUserRewardPosition } from './helpers';
import { TOKENS } from './tokens';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [rewardsList, balanceList] = await Promise.all([
    getUserRewardPosition(client, new PublicKey(owner)),
    getLendingPoolBalance(client, new PublicKey(owner)),
  ]);

  if (
    Object.keys(balanceList).length === 0 &&
    Object.keys(rewardsList).length === 0
  )
    return [];

  const lendingPoolInfos = await cache.getItem<
    {
      pool: string;
      totalAmount: string;
      scale: number;
      totalShareMintSupply: string;
    }[]
  >(lendingPoolsCacheKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  if (!lendingPoolInfos) throw new Error('Lending pools not cached');

  const assets = lendingPoolInfos
    .map((info) => {
      if (!TOKENS[info.pool]) return null;
      const rewardPosition = rewardsList[info.pool]?.amount || new BigNumber(0);
      const balancePosition =
        balanceList[info.pool]?.amount || new BigNumber(0);
      const totalPosition = rewardPosition.plus(balancePosition);
      if (totalPosition.isZero()) return null;
      const sharePrice = new BigNumber(info.totalAmount).dividedBy(
        info.totalShareMintSupply
      );

      return {
        address: TOKENS[info.pool].mintAddress.toString(),
        amount: sharePrice.multipliedBy(totalPosition),
      };
    })
    .filter((i) => i !== null);

  if (assets.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementBorrowlend({
    label: 'Lending',
    link: 'https://francium.io/app/lend',
  });

  assets.forEach((asset) => asset && element.addSuppliedAsset(asset));

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lending`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
