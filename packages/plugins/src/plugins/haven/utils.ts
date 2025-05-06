import { PublicKey } from '@solana/web3.js';
import { programId } from './constants';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { positionStruct } from './structs';
import { getClientSolana } from '../../utils/clients';

function bufferFromU8(num: number): Buffer {
  const buffer = Buffer.alloc(1);
  buffer.writeUInt8(num);
  return buffer;
}

function bufferFromU64(num: bigint): Buffer {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(num);
  return buffer;
}

function getSolautoPositionAccount(authority: PublicKey, positionId: number) {
  const fakePosition = positionId >= 256;
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  const [positionAccount, _] = PublicKey.findProgramAddressSync(
    [
      fakePosition
        ? bufferFromU64(BigInt(positionId))
        : bufferFromU8(positionId),
      authority.toBuffer(),
    ],
    programId
  );

  return positionAccount;
}

export async function getPositionAccounts(owner: string) {
  const connection = getClientSolana();

  const accounts = [];
  let index = 1;

  while (true) {
    const positionPda = getSolautoPositionAccount(new PublicKey(owner), index);
    const positionAccount = await getParsedAccountInfo(
      connection,
      positionStruct,
      positionPda
    );
    if (!positionAccount) break;
    accounts.push(positionAccount);
    index += 1;
  }

  return accounts;
}
