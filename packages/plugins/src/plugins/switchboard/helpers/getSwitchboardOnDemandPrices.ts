import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { toBN } from '../../../utils/misc/toBN';
import { pullFeedAccountDataStruct } from '../structs';
import { PRICE_PRECISION_EXP } from '../../drift/perpHelpers/constants';
import { SolanaClient } from '../../../utils/clients/types';

const SB_PRECISION_EXP = new BN(18);
const SB_PRECISION = new BN(10).pow(SB_PRECISION_EXP.sub(PRICE_PRECISION_EXP));

export async function getSwitchboardOnDemandPrice(
  client: SolanaClient,
  onDemandPubkey: PublicKey
): Promise<number | undefined> {
  const account = await client.getAccountInfo(onDemandPubkey);
  if (!account) return undefined;

  const [pullFeedAccountData] = pullFeedAccountDataStruct.deserialize(
    account.data
  );

  return toBN(pullFeedAccountData.result.value).div(SB_PRECISION).toNumber();
}
