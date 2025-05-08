import {
  getUsdValueSum,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import {
  IOUTokensElementName,
  mergeMineProgramId,
  mineProgramId,
  platformId,
  rewardersCacheKey,
} from './constants';
import { platformId as thevaultPlatformId } from '../thevault/constants';
import { platformId as saberPlatformId } from '../saber/constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { DetailedTokenInfo, Rewarder } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { calculatePositions } from './calculatePositions';
import {
  mergeMinerStruct,
  MergeMiner,
  minerStruct,
  Miner,
  quarryStruct,
  Quarry,
} from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const rewardersMemo = new MemoizedCache<Rewarder[]>(rewardersCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [mergeMinerAccounts, minerAccounts] = await Promise.all([
    ParsedGpa.build(connection, mergeMinerStruct, mergeMineProgramId)
      .addRawFilter(40, owner)
      .addDataSizeFilter(97)
      .run()
      .then(
        (accs) =>
          accs.filter(
            (acc) => acc !== null && !acc.primaryBalance.isZero()
          ) as ParsedAccount<MergeMiner>[]
      ),
    ParsedGpa.build(connection, minerStruct, mineProgramId)
      .addRawFilter(40, owner)
      .addDataSizeFilter(145)
      .run()
      .then(
        (accs) =>
          accs.filter(
            (acc) => acc !== null && !acc.balance.isZero()
          ) as ParsedAccount<Miner>[]
      ),
  ]);
  if (mergeMinerAccounts.length === 0 && minerAccounts.length === 0) return [];

  const replicaMinerAccounts = await Promise.all(
    mergeMinerAccounts.map((mmAcount) =>
      ParsedGpa.build(connection, minerStruct, mineProgramId)
        .addRawFilter(40, mmAcount.pubkey.toString())
        .addDataSizeFilter(145)
        .run()
    )
  );

  const quarryAccounts = await getParsedMultipleAccountsInfo(
    connection,
    quarryStruct,
    [...minerAccounts, ...[...replicaMinerAccounts.values()].flat()].map(
      (m) => new PublicKey(m.quarry)
    )
  ).then(
    (accs) => accs.filter((acc) => acc !== null) as ParsedAccount<Quarry>[]
  );

  const allRewarders = await rewardersMemo.getItem(cache);
  if (!allRewarders) throw new Error('Rewarders not cached');

  const positions = calculatePositions(
    mergeMinerAccounts,
    minerAccounts,
    replicaMinerAccounts,
    allRewarders,
    quarryAccounts,
    owner
  );

  if (positions.length === 0) return [];

  const mints = new Set<string>();
  positions.forEach((position) => {
    if (!position.stakedTokenInfo) return;
    mints.add(position.stakedTokenInfo.address);
    position.rewardsTokenInfo.forEach((rewardTokenInfo) =>
      mints.add(rewardTokenInfo.address.toString())
    );
  });
  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.solana);

  const elements: PortfolioElement[] = [];

  positions.forEach((position) => {
    const {
      rewardsTokenInfo,
      rewardsBalance,
      primaryRewarder,
      stakedBalance,
      stakedTokenInfo,
    } = position;

    const assets: PortfolioAssetToken[] = [];
    const rewardAssets: PortfolioAssetToken[] = [];

    if (!stakedTokenInfo) return;
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

    rewardsTokenInfo.forEach(
      (rewardTokenInfo: DetailedTokenInfo, i: number) => {
        if (rewardsBalance[i].isZero()) return;

        const rewardTokenPrice = tokenPrices.get(rewardTokenInfo.address);

        if (rewardTokenPrice) {
          rewardAssets.push(
            tokenPriceToAssetToken(
              rewardTokenPrice.elementName === IOUTokensElementName &&
                rewardTokenPrice.underlyings?.length === 1
                ? rewardTokenPrice.underlyings[0].address
                : rewardTokenPrice.address,
              rewardsBalance[i]
                .dividedBy(10 ** rewardTokenPrice.decimals)
                .toNumber(),
              NetworkId.solana,
              rewardTokenPrice
            )
          );
        } else {
          rewardAssets.push({
            networkId: NetworkId.solana,
            type: 'token',
            value: null,
            attributes: {},
            name: rewardTokenInfo.symbol,
            data: {
              amount: new BigNumber(rewardsBalance[i])
                .dividedBy(10 ** rewardTokenInfo.decimals)
                .toNumber(),
              address: rewardTokenInfo.address,
              price: null,
            },
            imageUri: rewardTokenInfo.logoURI,
          });
        }
      }
    );

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
      name: elementPlatformId === platformId ? primaryRewarder.name : 'Quarry',
      data: {
        liquidities: [
          {
            assets,
            assetsValue,
            rewardAssets,
            rewardAssetsValue,
            value,
            yields: [],
            ref: position.ref,
            sourceRefs: position.sourceRefs,
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
