import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
  TokenAccountWithMetadata,
} from '../../../utils/solana';
import {
  derivePositionAddress,
  getAmountAFromLiquidityDelta,
  getAmountBFromLiquidityDelta,
  getUnClaimReward,
} from './helpers';
import { poolStruct, positionStruct } from './structs';
import { Rounding } from '../dlmm/dlmmHelper';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { getTokenAccountsByOwner } from '../../../utils/solana/getTokenAccountsByOwner';

export const getMeteoraCpammPositions = async (
  tokenAccounts: ParsedAccount<TokenAccountWithMetadata>[],
  cache: Cache
) => {
  const nftAccounts = tokenAccounts.filter(
    (x) => x.amount.isEqualTo(1) && x.metadata?.name === 'Meteora Position NFT'
  );

  if (!nftAccounts.length) return [];

  const client = getClientSolana();

  const pdas = nftAccounts
    .map((account) => (account ? derivePositionAddress(account.mint) : []))
    .flat();

  const positions = await getParsedMultipleAccountsInfo(
    client,
    positionStruct,
    pdas
  );

  const pools = await getParsedMultipleAccountsInfo(
    client,
    poolStruct,
    positions.map((position) => (position ? position.pool : [])).flat()
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const liqElement = registry.addElementLiquidity({ label: 'LiquidityPool' });
  for (const position of positions) {
    if (!position) continue;
    const pool = pools.find((p) => p?.pubkey.equals(position.pool));
    if (!pool) continue;

    const liq = liqElement.addLiquidity({
      ref: position.pubkey.toString(),
      sourceRefs: [{ address: pool.pubkey.toString(), name: 'Pool' }],
      link: `https://www.meteora.ag/dammv2/${pool.pubkey.toString()}`,
    });

    const tokenAmountA = getAmountAFromLiquidityDelta(
      position.unlockedLiquidity
        .plus(position.vestedLiquidity)
        .plus(position.permanentLockedLiquidity),
      pool.sqrtPrice,
      pool.sqrtMaxPrice,
      Rounding.Down
    );

    liq.addAsset({
      address: pool.tokenAMint,
      amount: tokenAmountA,
    });

    const tokenAmountB = getAmountBFromLiquidityDelta(
      position.unlockedLiquidity,
      pool.sqrtPrice,
      pool.sqrtMinPrice,
      Rounding.Down
    );

    liq.addAsset({
      address: pool.tokenBMint,
      amount: tokenAmountB,
    });

    const { rewards, feeTokenA, feeTokenB } = getUnClaimReward(pool, position);

    for (let i = 0; i < rewards.length; i++) {
      liq.addRewardAsset({
        address: pool.rewardInfos[i].mint,
        amount: rewards[i],
      });
    }

    liq.addRewardAsset({
      address: pool.tokenAMint.toString(),
      amount: feeTokenA,
    });
    liq.addRewardAsset({
      address: pool.tokenBMint.toString(),
      amount: feeTokenB,
    });
  }

  return registry.getElements(cache);
};

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = await getTokenAccountsByOwner(
    getClientSolana(),
    owner
  );

  return getMeteoraCpammPositions(potentialTokens, cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-cpamm-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
