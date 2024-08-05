import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStatics } from './constants';
import { usdcSolanaMint } from '../../utils/solana';

const executor: AirdropFetcherExecutor = async () =>
  getAirdropRaw({
    statics: airdropStatics,
    items: [
      { amount: 10, isClaimed: false, label: 'USDC', address: usdcSolanaMint },
    ],
  });
const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export default airdropFetcher;
