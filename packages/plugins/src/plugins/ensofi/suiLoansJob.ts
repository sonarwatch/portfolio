import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  loansCacheKey,
  LoanType,
  offersCacheKey,
  OfferType,
  platformId,
  State,
} from './constants';
import { Loan, Offer } from './types';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { ObjectResponse } from '../../utils/sui/types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const dynamicFields = await getDynamicFieldObjects<Offer | Loan>(
    client,
    State
  );

  const offers: ObjectResponse<Offer>[] = [];
  const loans: ObjectResponse<Loan>[] = [];

  dynamicFields.forEach((df) => {
    if (!df.data?.content) return;
    if (df.data.type.startsWith(OfferType)) {
      offers.push(df as ObjectResponse<Offer>);
    } else if (df.data.type.startsWith(LoanType)) {
      loans.push(df as ObjectResponse<Loan>);
    }
  });

  await cache.setItem(offersCacheKey, offers, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  await cache.setItem(loansCacheKey, loans, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};
const job: Job = {
  id: `${platformId}-loans`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
