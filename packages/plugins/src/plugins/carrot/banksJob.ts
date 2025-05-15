import { aprToApy, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, boostProgramId, banksCacheKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  computeInterestRates,
  wrappedI80F48toBigNumber,
} from '../marginfi/helpers';
import { BankInfo } from '../marginfi/types';
import { bankStruct } from '../marginfi/structs/Bank';
import { ParsedAccount } from '../../utils/solana';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await ParsedGpa.build(connection, bankStruct, boostProgramId)
    .addFilter('discriminator', [142, 49, 166, 242, 50, 66, 97, 188])
    .run();

  const banks: ParsedAccount<BankInfo>[] = [];

  for (let index = 0; index < accounts.length; index += 1) {
    const bank = accounts[index];
    const { lendingApr, borrowingApr } = computeInterestRates(bank);

    banks.push({
      ...bank,
      dividedAssetShareValue: wrappedI80F48toBigNumber(bank.assetShareValue)
        .div(10 ** bank.mintDecimals)
        .toString(),
      dividedLiabilityShareValue: wrappedI80F48toBigNumber(
        bank.liabilityShareValue
      )
        .div(10 ** bank.mintDecimals)
        .toString(),
      suppliedLtv: wrappedI80F48toBigNumber(bank.config.assetWeightMaint)
        .decimalPlaces(2)
        .toNumber(),
      suppliedYields: [
        {
          apy: aprToApy(lendingApr),
          apr: lendingApr,
        },
      ],
      borrowedWeight: wrappedI80F48toBigNumber(bank.config.liabilityWeightMaint)
        .decimalPlaces(2)
        .toNumber(),
      borrowedYields: [
        {
          apy: -aprToApy(borrowingApr),
          apr: -borrowingApr,
        },
      ],
    });
  }

  await cache.setItem(banksCacheKey, banks, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-banks`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
