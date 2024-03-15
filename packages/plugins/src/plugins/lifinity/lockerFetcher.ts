import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  LifinityLockerProgramId,
  platformId,
  lfntyDecimals,
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
  if (accounts.length !== 1) return [];

  const escrowAccount = accounts[0];

  const { amount, escrowEndsAt, duration } = escrowAccount;

  if (amount.isZero()) return [];

  const lfntyTokenPrice = await cache.getTokenPrice(
    lfntyMint,
    NetworkId.solana
  );

  const yearsLocked = duration.dividedBy(60 * 60 * 24 * 365).decimalPlaces(0);
  let name = 'Locked';
  if (escrowEndsAt.isZero()) {
    name += ` (${yearsLocked.toString()} year${
      yearsLocked.isGreaterThan(1) ? 's' : ''
    })`;
  }

  const asset = tokenPriceToAssetToken(
    lfntyMint,
    amount.dividedBy(10 ** lfntyDecimals).toNumber(),
    NetworkId.solana,
    lfntyTokenPrice,
    undefined,
    {
      lockedUntil: escrowEndsAt.times(1000).toNumber() || undefined,
    }
  );

  return [
    {
      label: 'Vesting',
      type: PortfolioElementType.multiple,
      data: { assets: [asset] },
      networkId: NetworkId.solana,
      platformId,
      value: asset.value,
      name,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-locker`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
