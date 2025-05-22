import { PublicKey } from '@solana/web3.js';

export const jupApiParams = process.env['PORTFOLIO_JUP_API_PARAM'];

export const voteProgramId = new PublicKey(
  'voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj'
);
export const lockerPubkey = new PublicKey(
  'CVMdMd79no569tjc5Sq7kzz8isbfCcFyBS5TLGsrZ5dN'
);

export const jupMint = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
export const jupDecimals = 6;

export const verifiedTokensCacheKey = 'verified_tokens';
