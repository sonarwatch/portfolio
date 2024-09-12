import {
  formatMoveTokenAddress,
  NetworkId,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { clmmPoolsPrefix, platformId, vaultManagerMap } from './constants';
import { extractStructTagFromType } from './helpers';
import { Pool, Vault, VaultToPoolMapItem } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const vaultToPoolMapItems = await getDynamicFieldObjects<VaultToPoolMapItem>(
    client,
    vaultManagerMap
  );

  const vaults = await multiGetObjects<Vault>(
    client,
    vaultToPoolMapItems
      .map(
        (vaultToPoolMapItem) => vaultToPoolMapItem.data?.content?.fields.name
      )
      .filter((v) => v !== null) as string[]
  );

  const pools = (
    await cache.getItems<Pool>(
      vaults
        .map((v) => v.data?.content?.fields.pool)
        .filter((s) => s !== null) as string[],
      {
        prefix: clmmPoolsPrefix,
        networkId: NetworkId.sui,
      }
    )
  ).filter((p) => p !== null) as Pool[];

  const tokenPriceSources = [];

  for (const vault of vaults) {
    if (!vault.data?.content) continue;

    const pool = pools.find(
      (p) => p.poolAddress === vault.data?.content?.fields.pool
    );
    if (!pool) continue;

    const { type_arguments: typeArgs } = extractStructTagFromType(
      vault.data.type
    );
    const [lpToken] = typeArgs;

    const totalSupply = new BigNumber(
      vault.data.content.fields.lp_token_treasury.fields.total_supply.fields.value
    );

    const balances: {
      [key: string]: BigNumber;
    } = {};

    vault.data.content.fields.positions.forEach((position) => {
      const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
        new BigNumber(position.fields.clmm_postion.fields.liquidity),
        pool.current_tick_index,
        bitsToNumber(
          position.fields.clmm_postion.fields.tick_lower_index.fields.bits
        ),
        bitsToNumber(
          position.fields.clmm_postion.fields.tick_upper_index.fields.bits
        ),
        false
      );

      if (tokenAmountA.isGreaterThan(0)) {
        const amount =
          balances[
            position.fields.clmm_postion.fields.coin_type_a.fields.name
          ] || new BigNumber(0);
        balances[position.fields.clmm_postion.fields.coin_type_a.fields.name] =
          amount.plus(tokenAmountA);
      }
      if (tokenAmountB.isGreaterThan(0)) {
        const amount =
          balances[
            position.fields.clmm_postion.fields.coin_type_b.fields.name
          ] || new BigNumber(0);
        balances[position.fields.clmm_postion.fields.coin_type_b.fields.name] =
          amount.plus(tokenAmountB);
      }
    });

    const coinMetadata = await client.getCoinMetadata({ coinType: lpToken });
    if (!coinMetadata) continue;

    const tokenPrices = await cache.getTokenPricesAsMap(
      Object.keys(balances).map((c) => formatMoveTokenAddress(c)),
      NetworkId.sui
    );

    const underlyings = Object.keys(balances)
      .map((address: string) => {
        const balance = balances[address];
        const tokenPrice = tokenPrices.get(formatMoveTokenAddress(address));
        if (!tokenPrice) return null;

        const amountPerLp = balance
          .dividedBy(10 ** tokenPrice.decimals)
          .dividedBy(totalSupply.dividedBy(10 ** coinMetadata.decimals));

        return {
          networkId: NetworkId.sui,
          address: tokenPrice.address,
          price: tokenPrice.price,
          decimals: tokenPrice.decimals,
          amountPerLp: amountPerLp.toNumber(),
        };
      })
      .filter((u) => u !== null) as TokenPriceUnderlying[];

    tokenPriceSources.push({
      id: vault.data.content.fields.id.id,
      weight: 1,
      address: formatMoveTokenAddress(lpToken),
      networkId: NetworkId.sui,
      platformId,
      decimals: coinMetadata.decimals,
      price: underlyings.reduce(
        (acc: number, u) => u.price * u.amountPerLp + acc,
        0
      ),
      underlyings,
      timestamp: Date.now(),
    });
  }

  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
