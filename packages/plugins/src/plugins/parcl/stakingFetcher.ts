import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, prclMint, stakingProgramId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getProgramAccounts } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  // https://github.com/pyth-network/governance/blob/f624ea17fd2e7b22c799ffc2a560257d155410a5/staking/app/StakeConnection.ts

  const accs = await getProgramAccounts(client, stakingProgramId, [
    {
      memcmp: {
        offset: 0,
        bytes: 'FM2r3wAdZaa',
      },
    },
    {
      memcmp: {
        offset: 8,
        bytes: owner,
      },
    },
  ]);

  if (accs.length === 0) return [];

  const tokenBalances = await Promise.all(
    accs.map(async (acc) => {
      const tokenAccount = await client.getTokenAccountBalance(
        PublicKey.findProgramAddressSync(
          [Buffer.from('custody'), acc.pubkey.toBuffer()],
          stakingProgramId
        )[0]
      );

      return Number(tokenAccount.value.amount);
    })
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://stake.parcllimited.com/',
  });

  accs.forEach((acc, i) => {
    element.addAsset({
      address: prclMint,
      amount: tokenBalances[i],
      ref: acc.pubkey.toString(),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
