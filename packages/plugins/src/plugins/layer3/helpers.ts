import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { BN } from 'bn.js';

export const parseContract = (buf: Buffer) => {
  const bufForVestingScheduleHeader = buf.slice(0, 33);
  const destinationAddress = new PublicKey(
    bufForVestingScheduleHeader.slice(0, 32)
  );
  const isInitialized = bufForVestingScheduleHeader[32] === 1;
  const header = {
    destinationAddress,
    isInitialized,
  };

  if (!header.isInitialized) {
    return undefined;
  }

  const bufForSchedule = buf.slice(33, 49);
  const releaseDate = new BigNumber(
    new BN(bufForSchedule.subarray(0, 8), 'le').toString()
  );
  const amount = new BigNumber(
    new BN(bufForSchedule.subarray(8, 8 + 16), 'le').toString()
  );

  return {
    destinationAddress: header.destinationAddress,
    schedule: {
      releaseDate,
      amount,
    },
  };
};
