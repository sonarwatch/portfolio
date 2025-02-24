import { Keypair, PublicKey } from '@solana/web3.js';
import { BulkAccountLoader, DriftClient, initialize } from '@drift-labs/sdk';
import {
  VaultClient,
  getVaultClient as getVaultClientSDK,
} from '@drift-labs/vaults-sdk';
import {
  AnchorProvider,
  Program,
  setProvider,
  Wallet,
} from '@project-serum/anchor';
import { vaultIdls } from './constants';
import { getClientSolana } from '../../utils/clients';

export const getVaultClient = async (programId?: string) => {
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (programId && vaultIdls[programId]) {
    const provider = new AnchorProvider(connection, wallet as Wallet, {});
    setProvider(provider);
    const vaultProgram = new Program(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      vaultIdls[programId],
      new PublicKey(programId),
      provider
    );
    return new VaultClient({
      driftClient,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      program: vaultProgram,
      cliMode: false,
    });
  }

  return getVaultClientSDK(connection, wallet, driftClient);
};
