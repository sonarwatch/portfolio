import {
  aprToApy,
  BorrowLendRate,
  borrowLendRatesPrefix,
  NetworkId,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { ensofiLendingProgramId, platformId } from './constants';
import { lendOfferAccountStruct, LendOfferStatus } from './structs';
import { u8ArrayToString } from '../../utils/solana';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const lendOffers = await ParsedGpa.build(
    connection,
    lendOfferAccountStruct,
    ensofiLendingProgramId
  )
    .addFilter('accountDiscriminator', [130, 140, 110, 73, 124, 199, 122, 81])
    .addDataSizeFilter(154)
    .run();
  const items = [];
  for (const lendOffer of lendOffers) {
    if (lendOffer.status !== LendOfferStatus.Created) continue;

    const apr = -lendOffer.interest / 10000;
    const blRate: BorrowLendRate = {
      borrowedAmount: 0,
      depositedAmount: lendOffer.amount.dividedBy(10 ** 6).toNumber(),
      borrowYield: {
        apr,
        apy: aprToApy(apr),
      },
      depositYield: {
        apr: 0,
        apy: 0,
      },
      platformId,
      poolName: u8ArrayToString(lendOffer.offerId).replace('lend_offer_', ''),
      tokenAddress: lendOffer.lendMintToken.toString(),
      utilizationRatio: 0,
      duration: lendOffer.duration.times(1000).toNumber(),
      ref: lendOffer.pubkey.toString(),
    };
    items.push({
      key: `${lendOffer.pubkey.toString()}-${lendOffer.lendMintToken.toString()}`,
      value: blRate,
    });
  }
  await cache.setItems(items, {
    prefix: borrowLendRatesPrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-solana-loans`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
