import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  solanaToken2022PidPk,
  tokenAccountStruct,
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

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const tokenAccounts = await client.getTokenAccountsByOwner(
    new PublicKey(owner),
    {
      programId: solanaToken2022PidPk,
    }
  );

  const nftAccounts = tokenAccounts.value.map((account) => {
    const parsedAccount = tokenAccountStruct.deserialize(
      account.account.data
    )[0];
    if (parsedAccount.amount.toNumber() === 1)
      return { ...parsedAccount, pubkey: account.pubkey };
    return undefined;
  });

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

const fetcher: Fetcher = {
  id: `${platformId}-cpamm-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
