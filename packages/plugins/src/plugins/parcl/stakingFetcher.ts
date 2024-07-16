import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId, prclMint, stakingProgramId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getProgramAccounts } from '../../utils/solana';
import { Position, PositionAccount } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const decodePosition = (buffer: Buffer): Position => ({
  amount: Number(buffer.readBigUInt64LE(1)),
  activationEpoch: Number(buffer.readBigUInt64LE(1 + 8)),
  unlockingStart: Number(buffer.readBigUInt64LE(1 + 8 + 8)),
});

const decodePositionAccount = (buffer: Buffer): PositionAccount => {
  let i = 0;
  buffer.slice(i, i + 8);
  i += 8;
  const owner = new PublicKey(buffer.slice(i, i + 32)).toString();
  i += 32;
  const positions: Position[] = [];
  let position: Position;
  for (let t = 0; t < 20; t++) {
    position = decodePosition(buffer.slice(i, i + 200));
    if (position.amount > 0) positions.push(position);
    else break;
    i += 200;
  }

  return {
    owner,
    positions,
  };
};

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accs = await getProgramAccounts(client, stakingProgramId, [
    {
      // account PositionData
      memcmp: {
        offset: 0,
        bytes: 'FM2r3wAdZaa',
      },
    },
    {
      memcmp: {
        offset: 8,
        bytes: new PublicKey(owner).toBase58(),
      },
    },
  ]);

  if (accs.length === 0) return [];

  const positions = accs.map(
    (acc) => acc && decodePositionAccount(acc.account.data)
  );

  const tokenPrice = await cache.getTokenPrice(prclMint, NetworkId.solana);
  if (!tokenPrice) return [];

  const assets: PortfolioAsset[] = [];

  positions.forEach((positionAccount) => {
    positionAccount.positions.forEach((position) => {
      assets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          new BigNumber(position.amount)
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber(),
          NetworkId.solana,
          tokenPrice
        )
      );
    });
  });

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
