import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { transactionIsCnftMint } from './transactionIsCnftMint';
import { systemContract } from '../../services/solana';
import { getTransactionParsedInstructions } from './getTransactionParsedInstructions';

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
  'fLiPgg2yTvmgfhiPkKriAHkDmmXGP6CdeFX9UF5o7Zc',
  'GUq7PhyAUZko2mPhv3CupmdJKQ61LH8VyrdsRL25q7zg',
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

  const instructions = getTransactionParsedInstructions(txn);

  // if only small sol transfers
  if (
    instructions.every(
      (i) =>
        i.programId.toString() === systemContract.address &&
        i.parsed.type === 'transfer' &&
        i.parsed.info.lamports <= 1000000
    )
  ) {
    return true;
  }

  // if cnft minted by third party, other than Drip.haus
  if (
    !txn.transaction.message.accountKeys.some(
      (accountKey) =>
        accountKey.signer &&
        accountKey.pubkey.toString() ===
          'DRiPPP2LytGjNZ5fVpdZS7Xi1oANSY3Df1gSxvUKpzny'
    ) &&
    transactionIsCnftMint(txn)
  ) {
    return true;
  }

  return false;
};
