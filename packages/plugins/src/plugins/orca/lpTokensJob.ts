import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@metaplex-foundation/js';
import { aquafarmsProgram, platformId } from './constants';
import { aquafarmFilters } from './filters';
import { getClientSolana } from '../../utils/clients';
import { aquafarmStruct } from './structs/aquafarms';
import { TokenAccount, tokenAccountStruct } from '../../utils/solana';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
// import { getYields } from './helpers';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const aquafarmsRes = await client.getProgramAccounts(aquafarmsProgram, {
    filters: aquafarmFilters,
  });
  const aquafarms = aquafarmsRes.map((i) => ({
    ...aquafarmStruct.deserialize(i.account.data)[0],
    pubkey: i.pubkey,
  }));

  const tokenAccountsToFetch = [
    ...aquafarms.map((a) => a.baseTokenVault),
    ...aquafarms.map((a) => a.rewardTokenVault),
  ];
  const tokenAccountsRes = await getMultipleAccountsInfoSafe(
    client,
    tokenAccountsToFetch
  );
  if (!tokenAccountsRes) return;
  const tokenAccountsMap: Map<string, TokenAccount> = new Map();
  tokenAccountsRes.forEach((tokenAccountRes, i) => {
    if (!tokenAccountRes) return;
    const tokenAccount = tokenAccountStruct.deserialize(
      tokenAccountRes.data
    )[0];
    tokenAccountsMap.set(tokenAccountsToFetch[i].toString(), tokenAccount);
  });

  for (let i = 0; i < aquafarms.length; i += 1) {
    const aquafarm = aquafarms[i];

    const baseMint = aquafarm.baseTokenMint.toString();
    const baseToken = await cache.getTokenPrice(baseMint, NetworkId.solana);
    if (!baseToken) continue;

    const baseVault = tokenAccountsMap.get(aquafarm.baseTokenVault.toString());
    if (!baseVault) continue;
    if (baseVault.amount.isZero()) continue;

    const farmMint = aquafarm.farmTokenMint.toString();
    const tokenSupplyRes = await fetchTokenSupplyAndDecimals(
      new PublicKey(farmMint),
      client,
      0
    );
    if (!tokenSupplyRes) continue;

    const { decimals: farmDecimals, supply: farmSupply } = tokenSupplyRes;
    const baseVaultAmount = baseVault.amount
      .div(10 ** baseToken.decimals)
      .toNumber();
    const baseVaultValue = baseVaultAmount * baseToken.price;
    const price = baseVaultValue / farmSupply;

    // Yields
    // const rewardToken = null;
    // const rewardVault = tokenAccountsMap.get(
    //   aquafarm.rewardTokenVault.toString()
    // );
    // if (rewardVault) rewardToken = tokenAccountsMap.get(rewardVault.mint.toString());
    // if (rewardVault)
    //   rewardToken = await cache.getTokenPrice(
    //     rewardVault.mint.toString(),
    //     NetworkId.solana
    //   );
    // let yields;
    // if (rewardToken) yields = getYields(aquafarm, rewardToken, baseVaultValue);
    // console.log('constexecutor:JobExecutor= ~ yields:', yields);

    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: farmMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: farmDecimals,
      price,
      underlyings: [
        {
          networkId: NetworkId.solana,
          address: baseToken.address,
          decimals: baseToken.decimals,
          price: baseToken.price,
          amountPerLp: baseVaultAmount / baseVaultValue,
        },
      ],
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  executor,
};
export default job;
