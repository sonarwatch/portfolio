import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, reservesCacheKey, superlendyProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { reserveStruct } from './structs';
import { ReserveInfo } from './types';

function findLpTokenMint(reserve: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [reserve.toBuffer(), Buffer.from('LP_TOKEN')],
    superlendyProgramId
  )[0];
}

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    reserveStruct,
    superlendyProgramId
  )
    .addFilter('accountDiscriminator', [82, 69, 83, 69, 82, 86, 69, 95])
    .run();

  const reserves: ReserveInfo[] = accounts.map((reserve) => {
    const underlyingReserve = accounts.find(
      (r) =>
        findLpTokenMint(r.pubkey).toString() ===
        reserve.liquidity.mint.toString()
    );

    const rightReserve = underlyingReserve || reserve;

    const availableAmount = rightReserve.liquidity.available_amount.shiftedBy(
      -rightReserve.liquidity.mint_decimals
    );

    const totalLiquidity = rightReserve.liquidity.borrowed_amount_wads
      .shiftedBy(-18)
      .plus(availableAmount);

    const lpTotalSupply = rightReserve.collateral.lp_total_supply.shiftedBy(
      -rightReserve.liquidity.mint_decimals
    );

    const lpExchangeRate = totalLiquidity.dividedBy(
      lpTotalSupply.isGreaterThan(0) ? lpTotalSupply : 1
    );

    return {
      pubkey: reserve.pubkey.toString(),
      exchange_rate: lpExchangeRate.toNumber(),
      mint: rightReserve.liquidity.mint.toString(),
    };
  });

  await cache.setItem(reservesCacheKey, reserves, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-reserves`,
  executor,
  labels: ['normal'],
};
export default job;
