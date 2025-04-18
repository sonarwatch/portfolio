import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { launchpadKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { fundingRecordStruct, LaunchState } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getFundingRecordPda } from './helpers';
import { LaunchCached } from './types';
import { PortfolioAssetTokenParams } from '../../utils/elementbuilder/Params';

const launchesMemo = new MemoizedCache<LaunchCached[]>(launchpadKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const launches = await launchesMemo.getItem(cache);
  if (!launches) throw new Error('No launches found in cache');

  const pdas = launches.map((launch) =>
    getFundingRecordPda(owner, launch.pubkey.toString())
  );
  const fundingAccounts = await getParsedMultipleAccountsInfo(
    connection,
    fundingRecordStruct,
    pdas
  );
  if (fundingAccounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  fundingAccounts.forEach((acc) => {
    if (!acc) return;

    const launch = launches.find(
      (l) => l.pubkey.toString() === acc.launch.toString()
    );
    if (!launch) return;

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      ref: acc.pubkey.toString(),
      sourceRefs: [{ address: launch.pubkey.toString(), name: 'Vault' }],
      link: `https://metadao.fi/launchpad/projects/${launch.pubkey.toString()}`,
    });

    const assetParam: PortfolioAssetTokenParams = {
      address: launch.usdcMint,
      amount: acc.committedAmount,
    };

    if (launch.state === LaunchState.Live) {
      assetParam.attributes = {
        lockedUntil: new BigNumber(launch.unixTimestampStarted)
          .plus(launch.secondsForLaunch)
          .times(1000)
          .toNumber(),
      };
    } else if (launch.state === LaunchState.Complete) {
      assetParam.address = launch.tokenMint;
      assetParam.amount = acc.committedAmount
        .dividedBy(launch.totalCommittedAmount)
        // It's always 10M tokens for the launch
        .times(10000000);
      assetParam.alreadyShifted = true;
      assetParam.attributes = { isClaimable: true };
    } else if (launch.state === LaunchState.Refunding) {
      assetParam.attributes = { isClaimable: true };
    }

    element.addAsset(assetParam);
  });
  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-launchpad`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
