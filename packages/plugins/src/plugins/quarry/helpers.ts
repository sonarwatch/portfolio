import { PublicKey } from '@solana/web3.js';
import { mergeMineProgramId, mineProgramId } from './constants';
import { MergeMiner, Miner, QuarryAndMint, QuarryPDA, Rewarder } from './types';
import { ParsedAccount } from '../../utils/solana';

const getQuarryPDA = (t: PublicKey, e: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Uint8Array.from(Buffer.from('Quarry', 'utf-8')), t.toBytes(), e.toBytes()],
    mineProgramId
  );

const getMergePoolPDA = (primaryMint: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from('MergePool', 'utf-8'), primaryMint.toBuffer()],
    mergeMineProgramId
  );

const getReplicaMintPDA = (primaryMint: PublicKey) => {
  const [t] = getMergePoolPDA(primaryMint);
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ReplicaMint', 'utf-8'), t.toBuffer()],
    mergeMineProgramId
  );
};

const getMergeMinerPDA = (pool: PublicKey, owner: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from('MergeMiner', 'utf-8'), pool.toBuffer(), owner.toBuffer()],
    mergeMineProgramId
  );

const getMinerPDA = (t: PublicKey, e: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Uint8Array.from(Buffer.from('Miner', 'utf-8')), t.toBytes(), e.toBytes()],
    mineProgramId
  );

export const getQuarryPDAs = (
  rewarders: Rewarder[],
  owner: PublicKey
): QuarryPDA[] => {
  const quarryAndMintsByTokenMint: { [key: string]: QuarryAndMint[] } = {};
  const e = rewarders.flatMap((rewarder: Rewarder) => {
    const n = new PublicKey(rewarder.rewarder);
    return rewarder.quarries.map((r) => {
      const i = r.stakedToken.mint.toString();
      const o = new PublicKey(rewarder.rewardsToken.mint);
      const quarryAndMint = {
        key: n,
        rewardsMint: o,
      };
      if (!quarryAndMintsByTokenMint[i]) quarryAndMintsByTokenMint[i] = [];
      quarryAndMintsByTokenMint[i].push(quarryAndMint);

      return [n, new PublicKey(i), o];
    });
  });

  return e.map((pks) => {
    const [rewarder, primaryMint, rewardsMint] = pks;
    const [o] = getReplicaMintPDA(primaryMint);
    const [a] = getQuarryPDA(rewarder, primaryMint);
    const [s] = getMergePoolPDA(new PublicKey(primaryMint));
    const [c] = getMergeMinerPDA(s, new PublicKey(owner));
    const [l] = getMinerPDA(a, c);
    const [d] = getMinerPDA(a, new PublicKey(owner));
    const h = quarryAndMintsByTokenMint[o.toString()] || [];
    const f = h.map((t) => {
      const [replicaQuarry] = getQuarryPDA(t.key, o);
      const [replicaMMMiner] = getMinerPDA(replicaQuarry, c);
      return {
        replicaQuarry,
        replicaMMMiner,
        rewardsMint: t.rewardsMint,
        rewarder: t.key,
      };
    });
    return {
      primaryQuarry: a,
      mm: c,
      mmMiner: l,
      ownerMiner: d,
      rewarder,
      rewardsToken: rewardsMint,
      replicas: f,
    };
  });
};

export const isMinerAccount = (
  account: ParsedAccount<Miner> | ParsedAccount<MergeMiner>
): account is ParsedAccount<Miner> =>
  (account as ParsedAccount<Miner>).quarry !== undefined;
