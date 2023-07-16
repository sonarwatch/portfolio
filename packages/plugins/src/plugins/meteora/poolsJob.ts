import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  TokenAccount,
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
} from '../../utils/solana';
import { pools } from './pools';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const meteoraPools = pools;
  const reserverAddresses: Set<PublicKey> = new Set();
  meteoraPools.forEach((pool) => {
    pool.reserveAccounts.forEach((reserve) => {
      reserverAddresses.add(new PublicKey(reserve));
    });
  });
  meteoraPools.map((pool) =>
    pool.reserveAccounts.map((reserve) => new PublicKey(reserve))
  );
  const reserveAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    Array.from(reserverAddresses)
  );
  if (!reserveAccounts) return;

  const reservesAccountByAddress: Map<string, TokenAccount> = new Map();
  reserveAccounts.forEach((reserve) => {
    if (!reserve) return;
    reservesAccountByAddress.set(
      reserve.pubkey.toString(),
      reserve as TokenAccount
    );
  });

  for (let id = 0; id < meteoraPools.length; id++) {
    const pool = meteoraPools[id];
    const { address } = pool;
    const underlyings = [];
    let supplyValue = 0;
    for (let index = 0; index < pool.reserveAccounts.length; index++) {
      const reserveAccount = reservesAccountByAddress.get(
        pool.reserveAccounts[index]
      );
      if (!reserveAccount) continue;

      const reserveTokenPrice = await cache.getTokenPrice(
        reserveAccount.mint.toString(),
        NetworkId.solana
      );
      if (!reserveTokenPrice) continue;

      const reserveAmount = new BigNumber(reserveAccount.amount.toString())
        .div(10 ** reserveTokenPrice.decimals)
        .toNumber();
      const reserveValue = reserveAmount * reserveTokenPrice.price;

      const underlying = {
        networkId: NetworkId.solana,
        address: reserveTokenPrice.address,
        decimals: reserveTokenPrice.decimals,
        price: reserveTokenPrice.price,
        amountPerLp: reserveAmount / reserveValue,
      };
      underlyings.push(underlying);
      supplyValue += reserveValue;
    }

    const tokenSupplyAndDecimalsRes = await fetchTokenSupplyAndDecimals(
      new PublicKey(address),
      client,
      0
    );
    if (!tokenSupplyAndDecimalsRes) continue;
    const { supply, decimals } = tokenSupplyAndDecimalsRes;

    if (supplyValue <= 0) continue;
    const price = supplyValue / supply;

    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address,
      networkId: NetworkId.solana,
      platformId,
      decimals,
      price,
      underlyings,
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
