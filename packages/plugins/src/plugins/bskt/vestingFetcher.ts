import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { bsktDecimals, bsktMint, bsktPid, platformId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vestingAccountStruct } from './structs';
import { vestingAccountFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ClaimResponse } from './types';

const oneDay = 1000 * 60 * 60 * 24;
const startDate = new Date(1709078400000);
const endDate = new Date(startDate.getTime() + 30 * oneDay);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const vestingAccounts = await getParsedProgramAccounts(
    client,
    vestingAccountStruct,
    bsktPid,
    vestingAccountFilter(owner)
  );
  const bsktTokenPrice = await cache.getTokenPrice(bsktMint, NetworkId.solana);

  if (vestingAccounts.length === 0) {
    const res: AxiosResponse<ClaimResponse> = await axios.get(
      `https://claim.bskt.fi/api/getClaim?wallet=${owner}`
    );
    if (res.data.amount) {
      const assets: PortfolioAsset[] = [];

      const totalAmount = new BigNumber(res.data.amount);
      const amountPerUnlock = new BigNumber(totalAmount).dividedBy(30);
      const daysSinceLaunch = new BigNumber(Date.now())
        .minus(startDate.getTime())
        .dividedBy(oneDay)
        .decimalPlaces(0, BigNumber.ROUND_DOWN);
      const unlockedSince = new Date(
        startDate.getTime() + daysSinceLaunch.times(oneDay).toNumber()
      );
      const claimableAmount = amountPerUnlock.times(daysSinceLaunch.minus(1));

      assets.push({
        ...tokenPriceToAssetToken(
          bsktMint,
          claimableAmount.toNumber(),
          NetworkId.solana,
          bsktTokenPrice
        ),
        attributes: {
          lockedUntil: unlockedSince.getTime(),
        },
      });

      const amountLeftLocked = totalAmount.minus(claimableAmount);
      if (!amountLeftLocked.isZero()) {
        assets.push({
          ...tokenPriceToAssetToken(
            bsktMint,
            totalAmount.minus(claimableAmount).toNumber(),
            NetworkId.solana,
            bsktTokenPrice
          ),
          attributes: {
            lockedUntil: endDate.getTime(),
          },
        });
      }

      return [
        {
          type: PortfolioElementType.multiple,
          label: 'Vesting',
          networkId: NetworkId.solana,
          platformId,
          data: { assets },
          value: getUsdValueSum(assets.map((asset) => asset.value)),
        },
      ];
    }
  }

  const assets: PortfolioAsset[] = [];
  for (const vesting of vestingAccounts) {
    if (vesting.totalAmount.isEqualTo(vesting.amountClaimed)) continue;
    const lastClaimedTm = vesting.lastClaimedAt.times(1000).toNumber();
    const amountPerUnlock = vesting.totalAmount.dividedBy(30);

    const daysSinceClaim = new BigNumber(
      (Date.now() - vesting.lastClaimedAt.times(1000).toNumber()) / oneDay
    )
      .decimalPlaces(0, BigNumber.ROUND_DOWN)
      .toNumber();

    const amountAvailable = amountPerUnlock.times(daysSinceClaim);
    const unlockedSince = new Date(lastClaimedTm + daysSinceClaim * oneDay);

    if (!amountAvailable.isZero() && unlockedSince < endDate) {
      assets.push({
        ...tokenPriceToAssetToken(
          bsktMint,
          amountAvailable.dividedBy(10 ** bsktDecimals).toNumber(),
          NetworkId.solana,
          bsktTokenPrice
        ),
        attributes: {
          lockedUntil: unlockedSince.getTime(),
        },
      });
    }

    const nextUnlock = new Date(lastClaimedTm + (daysSinceClaim + 1) * oneDay);
    if (nextUnlock < endDate) {
      assets.push({
        ...tokenPriceToAssetToken(
          bsktMint,
          amountPerUnlock.dividedBy(10 ** bsktDecimals).toNumber(),
          NetworkId.solana,
          bsktTokenPrice
        ),
        attributes: {
          lockedUntil: nextUnlock.getTime(),
        },
      });
    }

    const amountLockedLeft = vesting.totalAmount
      .minus(vesting.amountClaimed)
      .minus(amountAvailable);
    if (!amountLockedLeft.isZero()) {
      assets.push({
        ...tokenPriceToAssetToken(
          bsktMint,
          amountLockedLeft.dividedBy(10 ** bsktDecimals).toNumber(),
          NetworkId.solana,
          bsktTokenPrice
        ),
        attributes: {
          lockedUntil: endDate.getTime(),
        },
      });
    }
  }

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Vesting',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-vesting`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
