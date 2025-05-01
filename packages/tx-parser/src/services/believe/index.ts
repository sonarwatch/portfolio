import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { bondingCurveContract } from '../meteora';

const platformId = 'believe';

const signer = '5qWya6UjwWnGVhdSBL3hyZ7B45jbk6Byt1hwd7ohEGXE';

const service: ServiceDefinition = {
  id: `${platformId}-launch`,
  name: 'Launchacoin',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) => {
    const believeIsSigner = tx.transaction.message.accountKeys.some(
      (acc) => acc.signer && acc.pubkey.toString() === signer
    );
    const isUsingMeteoraBondingCurveProgram =
      tx.transaction.message.instructions.some(
        (instruction) =>
          instruction.programId.toString() === bondingCurveContract.address
      );
    return believeIsSigner && isUsingMeteoraBondingCurveProgram;
  },
};

export const services: ServiceDefinition[] = [service];
export default services;
