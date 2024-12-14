import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  // airdropFetcherToFetcher,
} from '../../AirdropFetcher';

import { getAirdropItems } from './helpers';
import { airdropStatics } from './constants';

const solanaExecutor: AirdropFetcherExecutor = async (owner: string) =>
  getAirdropItems(owner, NetworkId.solana);

const aptosExecutor: AirdropFetcherExecutor = async (owner: string) =>
  getAirdropItems(owner, NetworkId.aptos);

const suiExecutor: AirdropFetcherExecutor = async (owner: string) =>
  getAirdropItems(owner, NetworkId.sui);

const ethereumExecutor: AirdropFetcherExecutor = async (owner: string) =>
  getAirdropItems(owner, NetworkId.ethereum);

export const airdropFetcherSolana: AirdropFetcher = {
  id: `${airdropStatics.id}-${NetworkId.solana}`,
  networkId: NetworkId.solana,
  executor: solanaExecutor,
};

export const airdropFetcherAptos: AirdropFetcher = {
  id: `${airdropStatics.id}-${NetworkId.aptos}`,
  networkId: NetworkId.aptos,
  executor: aptosExecutor,
};
export const airdropFetcherSui: AirdropFetcher = {
  id: `${airdropStatics.id}-${NetworkId.sui}`,
  networkId: NetworkId.sui,
  executor: suiExecutor,
};

export const airdropFetcherEthereum: AirdropFetcher = {
  id: `${airdropStatics.id}-${NetworkId.ethereum}`,
  networkId: NetworkId.ethereum,
  executor: ethereumExecutor,
};

// export const fetcher = airdropFetcherToFetcher(
//   airdropFetcher,
//   platform.id,
//   'suilend-airdrop',
//   airdropStatics.claimEnd
// );
