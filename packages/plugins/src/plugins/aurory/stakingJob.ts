import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { mintAccountStruct, tokenAccountStruct } from '../../utils/solana';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import {
  auryMint,
  decimals,
  platformId,
  vaultPubkey,
  xAuryMint,
} from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const vaultAccount = await getParsedAccountInfo(
    client,
    tokenAccountStruct,
    vaultPubkey
  );

  const tokenInfo = await getParsedAccountInfo(
    client,
    mintAccountStruct,
    new PublicKey(xAuryMint)
  );

  const auryTokenPrice = await cache.getTokenPrice(auryMint, NetworkId.solana);

  if (tokenInfo && vaultAccount && auryTokenPrice) {
    const xAurySupply = tokenInfo.supply.dividedBy(10 ** tokenInfo.decimals);

    const auryAmount = vaultAccount.amount.dividedBy(10 ** decimals);

    const xAuryPrice = auryAmount
      .dividedBy(xAurySupply)
      .times(auryTokenPrice.price);

    await cache.setTokenPriceSource({
      address: xAuryMint,
      decimals: 9,
      id: vaultAccount.pubkey.toString(),
      networkId: NetworkId.solana,
      platformId,
      price: xAuryPrice.toNumber(),
      timestamp: Date.now(),
      weight: 1,
    });
  }
};

const job: Job = {
  id: `${platformId}-staking`,
  executor,
  label: 'normal',
};
export default job;
