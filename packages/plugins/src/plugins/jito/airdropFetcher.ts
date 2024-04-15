import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  jtoDecimals,
  jtoMint,
  merkleDistributor,
  merkleTree,
  platformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { deriveClaimStatus } from '../jupiter/helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { claimStatusStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const jtoFactor = new BigNumber(10 ** jtoDecimals);
const endOfVesting = 1733529600000; // December 07 2024
const endOfClaim = 1749254400000; // June 07 2025
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  if (Date.now() > endOfClaim) return [];
  const client = getClientSolana();

  const claimStatus = await getParsedAccountInfo(
    client,
    claimStatusStruct,
    deriveClaimStatus(owner, merkleTree, merkleDistributor)
  );
  if (!claimStatus) return [];
  if (claimStatus.lockedAmount.isZero()) return [];

  const tokenPrice = await cache.getTokenPrice(jtoMint, NetworkId.solana);
  const amountleft = claimStatus.lockedAmount
    .minus(claimStatus.lockedAmountWithdrawn)
    .dividedBy(jtoFactor);

  const asset = tokenPriceToAssetToken(
    jtoMint,
    amountleft.toNumber(),
    NetworkId.solana,
    tokenPrice,
    undefined,
    { lockedUntil: endOfVesting }
  );

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Vesting',
      networkId: NetworkId.solana,
      platformId,
      name: 'Airdrop',
      data: {
        assets: [asset],
      },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
