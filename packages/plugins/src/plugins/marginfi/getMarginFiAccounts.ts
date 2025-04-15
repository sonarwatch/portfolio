import { PublicKey } from '@solana/web3.js';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  BalanceWithBank,
  MarginfiAccount,
  marginfiAccountStruct,
} from './structs/MarginfiAccount';
import { Cache } from '../../Cache';
import { ParsedAccount } from '../../utils/solana';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { BankInfo } from './types';

export const getMarginFiAccounts = async (
  authority: string,
  config: {
    pid: PublicKey;
    group: PublicKey;
    memo: MemoizedCache<
      ParsedAccount<BankInfo>[],
      Map<string, ParsedAccount<BankInfo>>
    >;
  },
  cache: Cache
): Promise<
  (
    | (ParsedAccount<MarginfiAccount> & {
        balances: (BalanceWithBank | null)[];
      })
    | null
  )[]
> => {
  const client = getClientSolana();
  const accounts = await ParsedGpa.build(
    client,
    marginfiAccountStruct,
    config.pid
  )
    .addFilter('discriminator', [67, 178, 130, 109, 126, 114, 28, 42])
    .addFilter('group', config.group)
    .addRawFilter(40, authority)
    .run();

  if (accounts.length === 0) return [];

  const banksInfoByAddress = await config.memo.getItem(cache);
  if (!banksInfoByAddress) throw new Error('MarginFi banks not cached');

  return accounts.map((marginfiAccount) => {
    const { balances } = marginfiAccount.lendingAccount;
    if (!balances || balances.length === 0) return null;

    return {
      ...marginfiAccount,
      balances: balances.map((balance) => {
        if (balance.bankPk.toString() === '11111111111111111111111111111111')
          return null;

        const bank = banksInfoByAddress.get(balance.bankPk.toString());
        if (!bank) return null;

        return {
          ...balance,
          bank,
        } as BalanceWithBank;
      }),
    };
  });
};
