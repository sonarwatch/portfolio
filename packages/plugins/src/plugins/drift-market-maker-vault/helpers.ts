import { Keypair, PublicKey } from '@solana/web3.js';
import { DriftClient, initialize, BulkAccountLoader } from '@drift-labs/sdk';
import { Wallet } from '@project-serum/anchor';
import { getVaultClient as getVaultClientSDK } from '@drift-labs/vaults-sdk';
import { getClientSolana } from '../../utils/clients';

export const getVaultClient = async () => {
  const connection = getClientSolana();
  const sdkConfig = initialize({ env: 'mainnet-beta' });
  const driftPublicKey = new PublicKey(sdkConfig.DRIFT_PROGRAM_ID);
  // random, we do not use it
  const wallet = new Wallet(new Keypair());
  const bulkAccountLoader = new BulkAccountLoader(
    connection,
    'confirmed',
    1000
  );
  const driftClient = new DriftClient({
    connection,
    wallet,
    programID: driftPublicKey,
    accountSubscription: {
      type: 'polling',
      accountLoader: bulkAccountLoader,
    },
  });
  await driftClient.subscribe();
  return getVaultClientSDK(connection, wallet, driftClient);
};
