import { PublicKey } from '@solana/web3.js';

export const platformId = 'jupiter';
export const jlpPool = new PublicKey(
  '5BUwFW4nRbftYTDMbgxykoFWqWHPzahFSNAaaaJtVKsq'
);
export const jlpToken = new PublicKey(
  '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4'
);

export const perpsProgramId = new PublicKey(
  'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu'
);

export const merkleDistributorPid = new PublicKey(
  'meRjbQXFNf5En86FXT2YPz1dQzLj4Yb3xK8u1MVgqpb'
);

export const jupMint = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
export const jupDecimals = 6;

export const merkleApi =
  'https://worker.jup.ag/jup-claim-proof/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/';
export const custodiesKey = 'custodies';
