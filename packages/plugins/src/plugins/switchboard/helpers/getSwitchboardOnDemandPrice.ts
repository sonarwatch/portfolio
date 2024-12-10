import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { pullFeedAccountDataStruct } from '../structs';
import { getMultipleAccountsInfoSafe } from '../../../utils/solana/getMultipleAccountsInfoSafe';
import { SolanaClient } from '../../../utils/clients/types';

const SB_PRECISION = new BigNumber(10 ** 18);

export async function getSwitchboardOnDemandPrices(
  client: SolanaClient,
  onDemandPubkeys: PublicKey[]
): Promise<(number | undefined)[]> {
  const slot = await client.getSlot();

  const prices: (undefined | number)[] = [];
  const accounts = await getMultipleAccountsInfoSafe(client, onDemandPubkeys);

  for (const account of accounts) {
    if (!account) {
      prices.push(undefined);
      continue;
    }

    const [pullFeedAccountData] = pullFeedAccountDataStruct.deserialize(
      account.data
    );

    // If the data is more than ~15 minutes old (1 slot = 400ms), dismiss it
    if (pullFeedAccountData.result.slot.isLessThan(slot - 60 * 10 * 2.5)) {
      prices.push(undefined);
    } else {
      prices.push(
        pullFeedAccountData.result.value.dividedBy(SB_PRECISION).toNumber()
      );
    }
  }

  return prices;
}
