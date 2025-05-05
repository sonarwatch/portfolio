import { PublicKey } from '@solana/web3.js';
import { solanaNativeWrappedAddress } from '@sonarwatch/portfolio-core';
import { usdcSolanaMint } from '../../utils/solana';
import { jitoSOLMint } from '../jito/constants';
import { mSOLMint } from '../marinade/constants';

export const platformId = 'cytonic';
export const pid = new PublicKey(
  'HYDqq5GfUj4aBuPpSCs4fkmeS7jZHRhrrQ3q72KsJdD4'
);

// You can find the list of assets inside cytonic frontend, look for sol address

// To find the vault, run :
// assetsConfigs.map(
//   (asset) =>
//     PublicKey.findProgramAddressSync(
//       [
//         Buffer.from('vault-data', 'utf-8'),
//         new PublicKey(
//           'CGXZkg4SP7ogYbad3Jm1myew827xdDEBCrtQnscKYEaX'
//         ).toBuffer(),
//         new PublicKey(asset).toBuffer(),
//       ],
//       pid
//     )[0]
// );
export const assetsConfigs: { mint: string; vault: string }[] = [
  {
    mint: solanaNativeWrappedAddress,
    vault: '4nsvUvEGo4AbUYTgT46RhPCV81KbxGnzHfxnHaNZantA',
  },
  {
    mint: usdcSolanaMint,
    vault: 'Ey1gR9BnFpVCD6UwWit9KbEQz5qXJbP75BmYCoxcfqD8',
  },
  {
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    vault: 'DurSN134DtPxv9DT2EdDemLftwqLuFPKCu98NEfna63W',
  },
  { mint: jitoSOLMint, vault: 'F82gzrGRNM5am9Eo1umL5vh4m7mMHaGeUhu8ymZPvaWk' },
  { mint: mSOLMint, vault: 'HS8YCGvg4d3bgqbNV2PGXjyAKLiDmZ2GJKWyKJFSoLHH' },
];
