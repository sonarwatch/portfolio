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
  if (accounts.length === 0 || accounts.length > 1) return [];

  const escrowAccount = accounts[0];

  // amount = amount.plus(account.amount.times(daysLocked).dividedBy(1460));
  const { amount } = escrowAccount;

  if (amount.isZero()) return [];

  const daysLocked = escrowAccount.duration
    .dividedBy(60 * 60 * 24)
    .decimalPlaces(0);
  const yearsLocked = escrowAccount.duration
    .dividedBy(60 * 60 * 24 * 365)
    .decimalPlaces(0);
  const yearsText = yearsLocked.isEqualTo(1)
    ? `Locked (${yearsLocked} year)`
    : `Locked (${yearsLocked} years)`;

  const status = escrowAccount.escrow_ends_at.isZero()
    ? yearsText
    : `Unlocking (${daysLocked} days left)`;

  const lfntyTokenPrice = await cache.getTokenPrice(
    lfntyMint,
    NetworkId.solana
  );

  const asset = tokenPriceToAssetToken(
    lfntyMint,
    amount.dividedBy(10 ** lfntyDecimals).toNumber(),
    NetworkId.solana,
    lfntyTokenPrice
  );

  return [
    {
      label: 'Vesting',
      type: PortfolioElementType.single,
      data: { asset },
      networkId: NetworkId.solana,
      platformId,
      value: asset.value,
      name: status,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-locker`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
