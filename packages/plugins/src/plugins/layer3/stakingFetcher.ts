import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { l3Mint, platformId, programId } from './constants';
import {
  associatedTokenProgramId,
  getProgramAccounts,
  solanaTokenPidPk,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { parseContract } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [destinationAddress] = PublicKey.findProgramAddressSync(
    [
      new PublicKey(owner).toBuffer(),
      solanaTokenPidPk.toBuffer(),
      l3Mint.toBuffer(),
    ],
    associatedTokenProgramId
  );

  const stakeAccounts = await getProgramAccounts(client, programId, [
    { dataSize: 49 },
    {
      memcmp: {
        offset: 0,
        bytes: destinationAddress.toString(),
      },
    },
  ]);
  if (stakeAccounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (const stakeAccount of stakeAccounts) {
    const contract = parseContract(stakeAccount.account.data);
    if (!contract) continue;

    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      ref: stakeAccount.pubkey,
      link: 'https://solana.layer3.xyz/rewards?tab=staking',
    });

    element.addAsset({
      address: l3Mint,
      amount: contract.schedule.amount,
      attributes: {
        lockedUntil: contract.schedule.releaseDate.isPositive()
          ? new Date(
              contract.schedule.releaseDate.times(1000).toNumber()
            ).getTime()
          : undefined,
      },
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
