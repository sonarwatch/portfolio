import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, prclMint, stakingProgramId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getProgramAccounts } from '../../utils/solana';
import { Position, PositionAccount } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

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
        bytes: new PublicKey(owner).toString(),
      },
    },
  ]);

  if (accs.length === 0) return [];

  const positions = accs.map(
    (acc) => acc && decodePositionAccount(acc.account.data)
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });

  positions.forEach((positionAccount) => {
    element.addAsset({
      address: prclMint,
      amount: positionAccount.positions.reduce(
        (sum: number, position) => sum + Number(position.amount),
        0
      ),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
