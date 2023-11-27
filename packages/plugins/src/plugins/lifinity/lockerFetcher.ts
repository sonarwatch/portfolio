import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  LifinityLockerProgramId,
  platformId,
  veDecimals,
  lfntyMint,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { escrowStruct } from './structs';
import { escrowFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    escrowStruct,
    LifinityLockerProgramId,
    escrowFilter(owner)
  );
  if (accounts.length === 0) return [];

  let amount = new BigNumber(0);
  for (const account of accounts) {
    amount = amount.plus(account.amount);
  }

  if (amount.isZero()) return [];

  const lfntyTokenPrice = await cache.getTokenPrice(
    lfntyMint,
    NetworkId.solana
  );

  const asset = tokenPriceToAssetToken(
    lfntyMint,
    amount.dividedBy(10 ** veDecimals).toNumber(),
    NetworkId.solana,
    lfntyTokenPrice
  );
  return [
    {
      label: 'Staked',
      type: PortfolioElementType.single,
      data: { asset },
      networkId: NetworkId.solana,
      platformId,
      value: asset.value,
      name: 'veLFNTY',
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-locker`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
