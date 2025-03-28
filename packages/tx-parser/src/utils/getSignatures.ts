import {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
  SignaturesForAddressOptions,
} from '@solana/web3.js';

const MAX_SIGNATURES_PER_REQUEST = 10;

export const getSignatures = (
  connection: Connection,
  address: string,
  optionsArgs?: SignaturesForAddressOptions | undefined
): Promise<ConfirmedSignatureInfo[]> => {
  const options = optionsArgs || {};
  if (!optionsArgs?.limit || optionsArgs?.limit > MAX_SIGNATURES_PER_REQUEST) {
    options.limit = MAX_SIGNATURES_PER_REQUEST;
  }

  return connection.getSignaturesForAddress(
    new PublicKey(address),
    options,
    'confirmed'
  );
};
