import { PublicKey } from '@solana/web3.js';

const HAWKSIGHT_FARM = new PublicKey(
  '7jLQhREMxXjKdpwVuN6gwsWt3BNfAg9WqbepffPbi4ww'
);

const HAWKSIGHT_FARM_2 = new PublicKey(
  'CY6qutkyek6hh5UCQbbNyEXKoD4tFLFb2tjM3AHnhJcR'
);

const HAWKSIGHT_PROGRAM_ID = new PublicKey(
  'FqGg2Y1FNxMiGd51Q6UETixQWkF5fB92MysbYogRJb3P'
);

export function getHawksightUserPdas(owner: PublicKey): PublicKey[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return [
    PublicKey.findProgramAddressSync(
      [
        Buffer.from('multi-user', 'utf8'),
        HAWKSIGHT_FARM.toBuffer(),
        owner.toBuffer(),
      ],
      HAWKSIGHT_PROGRAM_ID
    )[0],
    PublicKey.findProgramAddressSync(
      [
        Buffer.from('multi-user', 'utf8'),
        HAWKSIGHT_FARM_2.toBuffer(),
        owner.toBuffer(),
      ],
      HAWKSIGHT_PROGRAM_ID
    )[0],
  ];
}
