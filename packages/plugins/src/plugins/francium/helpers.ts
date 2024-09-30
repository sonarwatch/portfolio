import { Connection, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  associatedTokenProgramId,
  getParsedMultipleAccountsInfo,
  solanaTokenPidPk,
} from '../../utils/solana';
import {
  lendingPoolList,
  lendingPools,
  lendRewardInfo,
  lendRewardProgramId,
} from './constants';
import { RewardUser, rewardUserStruct } from './structs';

const poolsWithReward = lendingPoolList.filter((i) => {
  const info = lendRewardInfo[i.pool];
  return !!info;
});

function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      walletAddress.toBuffer(),
      solanaTokenPidPk.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    associatedTokenProgramId
  );
  return publicKey;
}

export async function getUserRewardPosition(
  connection: Connection,
  userPublicKey: PublicKey
) {
  const infoAccounts = await Promise.all(
    poolsWithReward.map(async (i) => {
      const info = lendRewardInfo[i.pool];

      const associatedAccount = findAssociatedTokenAddress(
        userPublicKey,
        info.farmingPoolStakeTknMint
      );

      const [rewardInfoAccount] = PublicKey.findProgramAddressSync(
        [
          userPublicKey.toBuffer(),
          info.farmingPoolAccount.toBuffer(),
          associatedAccount.toBuffer(),
        ],
        lendRewardProgramId
      );
      return rewardInfoAccount;
    })
  );

  const accountInfos = await getParsedMultipleAccountsInfo<RewardUser>(
    connection,
    rewardUserStruct,
    infoAccounts
  );

  const result: { [key: string]: { scale: number; amount: BigNumber } } = {};

  accountInfos.forEach((acc, index) => {
    if (acc && acc?.staked_amount && acc.staked_amount.isGreaterThan(0)) {
      const targetPool = poolsWithReward[index];
      result[targetPool.pool] = {
        scale: targetPool.scale,
        amount: acc.staked_amount,
      };
    }
  });

  return result;
}

export async function getLendingPoolBalance(
  client: Connection,
  userPublicKey: PublicKey
) {
  const userTokenAccounts = await client.getParsedTokenAccountsByOwner(
    userPublicKey,
    {
      programId: solanaTokenPidPk,
    },
    'confirmed'
  );
  const result: { [key: string]: { scale: number; amount: BigNumber } } = {};

  lendingPoolList.forEach((i) => {
    const info = lendingPools[i.pool];
    const mint = info.lendingPoolShareMint;
    const account = userTokenAccounts.value.find((accountInfo) => {
      const parsedInfo = accountInfo.account.data.parsed.info;
      const mintAddress = parsedInfo.mint;
      return mintAddress === mint.toBase58();
    });
    if (account) {
      result[i.pool] = {
        amount: new BigNumber(
          account.account.data.parsed.info.tokenAmount.amount
        ),
        scale: i.scale,
      };
    }
  });

  return result;
}
