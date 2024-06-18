export type AirdropResponse = {
  amount_locked: number;
  amount_unlocked: number;
  proof: Array<number[]>;
  error?: string;
};
