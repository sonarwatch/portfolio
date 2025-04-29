import {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
  SignaturesForAddressOptions,
} from '@solana/web3.js';

export const MAX_TRANSACTIONS_PER_REQUEST = 500;

export const getSignatures = (
  connection: Connection,
  address: string,
  optionsArgs?: SignaturesForAddressOptions | undefined
): Promise<ConfirmedSignatureInfo[]> => {
  const options = optionsArgs || {};
  if (
    !optionsArgs?.limit ||
    optionsArgs?.limit > MAX_TRANSACTIONS_PER_REQUEST
  ) {
    options.limit = MAX_TRANSACTIONS_PER_REQUEST;
  }

  return connection.getSignaturesForAddress(
    new PublicKey(address),
    options,
    'confirmed'
  );
};
