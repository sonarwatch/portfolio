import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { airdropUrl, jtoDecimals, jtoMint, platformId } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ClaimStatus } from './types';

const jtoFactor = new BigNumber(10 ** jtoDecimals);
const endOfVesting = 1733529600000; // December 07 2024
const endOfClaim = 1749254400000; // June 07 2025
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  if (Date.now() > endOfClaim) return [];

  const [res, tokenPrice] = await Promise.all([
    axios.get(airdropUrl + owner, { timeout: 1000 }).catch(() => null),
    cache.getTokenPrice(jtoMint, NetworkId.solana),
  ]);

  if (!res) return [];

  const claimStatus = res.data as ClaimStatus;

  const avaibleToClaim = new BigNumber(
    claimStatus.amount_locked_withdrawable
  ).dividedBy(jtoFactor);

  const vestedAmountLeft = new BigNumber(claimStatus.total_locked_searcher)
    .plus(claimStatus.total_locked_staker)
    .plus(claimStatus.total_locked_validator)
    .minus(claimStatus.amount_locked_withdrawn)
    .dividedBy(jtoFactor)
    .minus(avaibleToClaim);

  const assets: PortfolioAsset[] = [];
  if (!vestedAmountLeft.isZero())
    assets.push(
      tokenPriceToAssetToken(
        jtoMint,
        vestedAmountLeft.toNumber(),
        NetworkId.solana,
        tokenPrice,
        undefined,
        { lockedUntil: endOfVesting }
      )
    );

  if (!avaibleToClaim.isZero())
    assets.push(
      tokenPriceToAssetToken(
        jtoMint,
        avaibleToClaim.toNumber(),
        NetworkId.solana,
        tokenPrice,
        undefined,
        { isClaimable: true }
      )
    );
  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Airdrop',
      networkId: NetworkId.solana,
      platformId,
      data: {
        assets,
      },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
