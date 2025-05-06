import { PublicKey } from '@solana/web3.js';
import { solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { usdcSolanaMint } from '../../utils/solana';

export const platformId = 'bouncebit';
export const pid = new PublicKey(
  '65YBWQitcBexwuaBKfAV163xDd4LzVAdytATLbttpgxx'
);

// pda
/* const vaults = await ParsedGpa.build(connection, vaultStruct, pid)
  .addFilter('accountDiscriminator', [211, 8, 232, 43, 2, 152, 117, 119])
  .run(); */
export const vaults = [
  {
    pubkey: new PublicKey('8P1MNxqmrHhDrw74R2VN3BYuPhMrQ4XMxfYiTFUTqsf3'),
    mint: solanaNativeAddress,
  },
  {
    pubkey: new PublicKey('5SAqUmJSPDKE26SQyrUtngCFSQrRjPqUhKc8KyYjKbEM'),
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  },
  {
    pubkey: new PublicKey('6NPUfsgtqkbRKhKu32TutKrTSp6Hcc8XR5xhuyqdGpsj'),
    mint: usdcSolanaMint,
  },
];
