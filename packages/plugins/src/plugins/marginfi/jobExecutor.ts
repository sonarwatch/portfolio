import { Context, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { MarginfiProgram, prefix } from './constants';
import { bankStruct } from './structs/Bank';
import { banksFilters } from './filters';
import { wrappedI80F48toBigNumber } from './helpers';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';

const jobExecutor: JobExecutor = async (context: Context) => {
  const { cache } = context;
  const connection = getClientSolana();

  const banksRawData = await getParsedProgramAccounts(
    connection,
    bankStruct,
    MarginfiProgram,
    banksFilters()
  );

  for (let index = 0; index < banksRawData.length; index += 1) {
    const bank = banksRawData[index];
    await cache.setItem(
      bank.pubkey.toString(),
      {
        ...bank,
        dividedAssetShareValue: wrappedI80F48toBigNumber(
          bank.assetShareValue
        ).div(10 ** bank.mintDecimals),
        dividedLiabilityShareValue: wrappedI80F48toBigNumber(
          bank.liabilityShareValue
        ).div(10 ** bank.mintDecimals),
      },
      {
        prefix,
        networkId: NetworkId.solana,
      }
    );
  }
};
export default jobExecutor;
