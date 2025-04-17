import {
  NetworkId,
  solanaNativeWrappedAddress,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, u8ArrayToString } from '../../utils/solana';
import { vaultStateStruct } from './structs';
import { getDecimals } from '../../utils/solana/getDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    vaultStateStruct,
    programId,
    [{ memcmp: { offset: 0, bytes: 'fGKsWeCxBaF' } }, { dataSize: 3104 }]
  );

  if (!accounts.length) return;

  const solTokenPrice = await cache.getTokenPrice(
    solanaNativeWrappedAddress,
    NetworkId.solana
  );
  if (!solTokenPrice) return;

  const tokenPriceSources: TokenPriceSource[] = [];

  for (const acc of accounts) {
    const liquidityName = u8ArrayToString(acc.vault_name);

    if (liquidityName !== 'aiBASKT') continue;

    const vaultTokenMint = PublicKey.findProgramAddressSync(
      [Buffer.from('vault_token_mint'), acc.pubkey.toBuffer()],
      programId
    )[0];

    const vaultAuthMint = PublicKey.findProgramAddressSync(
      [Buffer.from('vault_auth'), acc.pubkey.toBuffer()],
      programId
    )[0];

    const [solReserve, solReserve2, decimals] = await Promise.all([
      connection.getBalance(vaultAuthMint),
      connection.getBalance(acc.vault_asset_holder),
      getDecimals(connection, vaultTokenMint),
    ]);

    if (!decimals) return;

    console.log('total_value_in_sol', acc.total_value_in_sol.toNumber());
    console.log('total_supply', acc.total_supply.toNumber());
    console.log('solReserve', solReserve + solReserve2);
    console.log(
      acc.total_value_in_sol
        .plus(solReserve)
        .plus(solReserve2)
        .dividedBy(acc.total_supply)
        .toNumber()
    );
    tokenPriceSources.push({
      id: acc.pubkey.toString(),
      weight: 1,
      address: vaultTokenMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals,
      price: acc.total_value_in_sol
        .plus(solReserve)
        .plus(solReserve2)
        .dividedBy(acc.total_supply)
        .multipliedBy(solTokenPrice.price)
        .toNumber(),
      label: 'LiquidityPool',
      liquidityName,
      timestamp: Date.now(),
      link: `https://www.baskt.fun/indices/${liquidityName}`,
      sourceRefs: [
        {
          name: 'Pool',
          address: acc.pubkey.toString(),
        },
      ],
    });
  }

  console.log(tokenPriceSources);

  await cache.setTokenPriceSources(tokenPriceSources);
};
const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
