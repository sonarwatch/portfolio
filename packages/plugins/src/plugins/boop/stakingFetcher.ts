import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { boopMint, pid, platformId, withdrawPid } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { unwrapRequestStruct, userStruct } from './structs';

function getUserPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from([117, 115, 101, 114]), new PublicKey(owner).toBuffer()],
    pid
  )[0];
}

function getWithdrawPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from([
        117, 110, 119, 114, 97, 112, 95, 114, 101, 113, 117, 101, 115, 116,
      ]),
      new PublicKey(owner).toBuffer(),
    ],
    withdrawPid
  )[0];
}

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const [stakingAccount, pendingWithdraw] = await Promise.all([
    getParsedAccountInfo(connection, userStruct, getUserPda(owner)),
    getParsedAccountInfo(
      connection,
      unwrapRequestStruct,
      getWithdrawPda(owner)
    ),
  ]);
  if (!stakingAccount && !pendingWithdraw) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });
  if (stakingAccount) {
    element.addAsset({
      address: boopMint,
      amount: stakingAccount.balance_staked,
      attributes: {
        lockedUntil: -1,
      },
      ref: stakingAccount.pubkey.toString(),
    });
    if (!stakingAccount.balance_staked.isZero()) {
      element.addAsset({
        address: boopMint,
        amount: stakingAccount.reward_per_token_pending,
        attributes: {
          isClaimable: true,
        },
        ref: stakingAccount.pubkey.toString(),
      });
    }
  }

  if (pendingWithdraw) {
    element.addAsset({
      address: boopMint,
      amount: pendingWithdraw.amount,
      attributes: {
        lockedUntil: pendingWithdraw.timestamp
          .plus(5 * 24 * 60 * 60)
          .times(1000)
          .toNumber(),
        tags: ['Withdraw'],
      },
      ref: pendingWithdraw.pubkey.toString(),
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
