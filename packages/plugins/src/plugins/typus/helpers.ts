import { BcsReader } from '@mysten/bcs';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '../../utils/clients/types';
import { DepositShare } from './types';
import {
  depositReceiptType,
  registryDovSingle,
  sender,
  viewDepositSharesType,
} from './constants';

export async function getDepositShares(
  provider: SuiClient,
  receipts: string[]
): Promise<DepositShare[] | undefined> {
  const transactionBlock = new TransactionBlock();
  const target = viewDepositSharesType as `${string}::${string}::${string}`;
  const transactionBlockArguments = [
    transactionBlock.pure(registryDovSingle),
    transactionBlock.makeMoveVec({
      type: depositReceiptType,
      objects: receipts.map((id) => transactionBlock.object(id)),
    }),
  ];
  transactionBlock.moveCall({
    target,
    typeArguments: [],
    arguments: transactionBlockArguments,
  });
  const { results } = await provider.devInspectTransactionBlock({
    transactionBlock,
    sender,
  });
  if (!results || results.length === 0) return undefined;

  const { returnValues } = results[results.length - 1];
  if (!returnValues) return undefined;

  const bytes = returnValues[0][0];
  const reader = new BcsReader(new Uint8Array(bytes));
  const res: DepositShare[] = reader.readVec((bcsReader) => {
    bcsReader.read8();
    const index = bcsReader.read64();
    const activeSubVaultUserShare = bcsReader.read64();
    const deactivatingSubVaultUserShare = bcsReader.read64();
    const inactiveSubVaultUserShare = bcsReader.read64();
    const warmupSubVaultUserShare = bcsReader.read64();
    const premiumSubVaultUserShare = bcsReader.read64();
    const incentiveShare = bcsReader.read64();
    return {
      index,
      activeSubVaultUserShare,
      deactivatingSubVaultUserShare,
      inactiveSubVaultUserShare,
      warmupSubVaultUserShare,
      premiumSubVaultUserShare,
      incentiveShare,
    } as DepositShare;
  });

  return res;
}
