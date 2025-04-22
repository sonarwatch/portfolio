import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { isParsedInstruction } from './isParsedInstruction';

const spammerAccounts = [
  'FLiPgGTXtBtEJoytikaywvWgbz5a56DdHKZU72HSYMFF',
  'FLiPGqowc82LLR173hKiFYBq2fCxLZEST5iHbHwj8xKb',
  '5Hr7wZg7oBpVhH5nngRqzr5W7ZFUfCsfEhbziZJak7fr',
  '5ifyfzJLkpThxrjvCmzTPRfpvUtBBkXLNb4URD7vq7Nm',
  'C38eZRbq4HxXM5YjikT9RpuYMyvQLpB8cujiUAtUq48V',
  '2kEMxpStc2JVMsMNhFPqeepVGWmkTuSExo8oqr4HabS6',
  'Habp5bncMSsBC3vkChyebepym5dcTNRYeg2LVG464E96',
  '9KxQy6StbkJhubAbfvfriUK6LYYJ5cSkBoS3ZhcbdUx2',
  'RecoWuBP1kCPABPVAABCR7f7FY513EVhQwoWcxntNT9',
];

export const transactionIsSpam = (
  txn: ParsedTransactionWithMeta,
  isSigner: boolean
): boolean => {
  if (isSigner) return false;

  // if spammer is known
  if (
    txn.transaction.message.accountKeys.some(
      (accountKey) =>
        accountKey.signer &&
        spammerAccounts.includes(accountKey.pubkey.toString())
    )
  ) {
    return true;
  }

  // if more than 10 small sol transfers
  const smallTransfers = txn.transaction.message.instructions.filter(
    (i) =>
      i.programId.toString() === '11111111111111111111111111111111' &&
      isParsedInstruction(i) &&
      i.parsed.type === 'transfer' &&
      i.parsed.info.lamports < 1000
  );
  return smallTransfers.length > 10;
};
