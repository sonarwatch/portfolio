import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { nosDecimals, nosMint, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { stakeStruct } from './structs';
import { getStakePubKey } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { tokenAccountStruct } from '../../utils/solana';

const nosFactor = new BigNumber(10 ** nosDecimals);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const stakeAccount = await getParsedAccountInfo(
    client,
    stakeStruct,
    getStakePubKey(owner)
  );
  if (!stakeAccount || stakeAccount.amount.isZero()) return [];

  const [vaultAccount, tokenPrice] = await Promise.all([
    getParsedAccountInfo(client, tokenAccountStruct, stakeAccount.vault),
    cache.getTokenPrice(nosMint, NetworkId.solana),
  ]);
  if (!vaultAccount || vaultAccount.amount.isZero()) return [];

  const lockedUntil = stakeAccount.timeUnstake.isZero()
    ? undefined
    : stakeAccount.timeUnstake
        .plus(stakeAccount.duration)
        .times(1000)
        .toNumber();

  const asset = tokenPriceToAssetToken(
    nosMint,
    vaultAccount.amount.dividedBy(nosFactor).toNumber(),
    NetworkId.solana,
    tokenPrice,
    undefined,
    { lockedUntil }
  );

  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.multiple,
      label: 'Staked',
      value: asset.value,
      data: {
        assets: [asset],
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
