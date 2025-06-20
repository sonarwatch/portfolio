import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { Cache } from '../../Cache';
import { pid, platformId, vaults } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { openRequestsStruct } from './structs';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Reward } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const openRequests = await getParsedMultipleAccountsInfo(
    connection,
    openRequestsStruct,
    vaults.map(
      (vault) =>
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('open_requests'),
            vault.pubkey.toBuffer(),
            new PublicKey(owner).toBuffer(),
          ],
          pid
        )[0]
    )
  );

  if (!openRequests.length) return [];

  let rewards: Reward[];
  try {
    const rewardsRes = await axios.get<{
      result: Reward[];
    }>(
      `https://api-portal.bouncebit.io/api/v2/rewards?address=${owner}&product=auto&status=active`,
      {
        timeout: 2000,
      }
    );
    rewards = rewardsRes.data.result;
  } catch (e) {
    /* empty */
  }

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  openRequests.forEach((openRequestsForVault, vi) => {
    if (!openRequestsForVault) return;
    const vault = vaults[vi];
    if (!openRequestsForVault.open_requests.length) return;
    if (!vault) return;

    const element = elementRegistry.addElementLiquidity({
      label: 'Deposit',
    });
    const liquidity = element.addLiquidity({
      ref: openRequestsForVault.pubkey,
      link: 'https://portal.bouncebit.io/cedefi',
      sourceRefs: [{ name: 'Strategy', address: vault.pubkey.toString() }],
    });

    openRequestsForVault.open_requests.forEach((openRequest) => {
      liquidity.addAsset({
        address: vault.mint,
        amount: openRequest.principal,
      });
    });

    if (rewards && rewards.length) {
      liquidity.addRewardAsset({
        address: vault.mint,
        amount: rewards
          .filter((reward) => reward.token === vault.mint)
          .reduce(
            (sum: number, currReward) =>
              currReward !== null
                ? sum + Number(currReward.strategyReward)
                : sum,
            0
          ),
      });
      liquidity.addRewardAsset({
        address: '76SYfdi8jT84GqxuTqu7FuyA4GQbrto1pLDGQKsy8K12',
        amount: rewards
          .filter((reward) => reward.token === vault.mint)
          .reduce(
            (sum: number, currReward) =>
              currReward !== null ? sum + Number(currReward.bbReward) : sum,
            0
          ),
        attributes: {
          tags: ['BB Rewards'],
        },
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
