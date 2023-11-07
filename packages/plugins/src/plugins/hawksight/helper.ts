import { PublicKey } from '@solana/web3.js';

const HAWKSIGHT_FARM = new PublicKey(
  '7jLQhREMxXjKdpwVuN6gwsWt3BNfAg9WqbepffPbi4ww'
);
const HAWKSIGHT_PROGRAM_ID = new PublicKey(
  'FqGg2Y1FNxMiGd51Q6UETixQWkF5fB92MysbYogRJb3P'
);

export function getHawksightUserPda(owner: PublicKey): PublicKey {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('multi-user', 'utf8'),
      HAWKSIGHT_FARM.toBuffer(),
      owner.toBuffer(),
    ],
    HAWKSIGHT_PROGRAM_ID
  );

  return pda;
}
