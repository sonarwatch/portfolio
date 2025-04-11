import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ensofiLiquidityPid, platformId } from './constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { protocolPositionStruct, userPositionStruct } from './structs';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { poolStateStruct } from '../raydium/structs/clmms';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [userPositions] = await Promise.all([
    ParsedGpa.build(connection, userPositionStruct, ensofiLiquidityPid)
      .addFilter('accountDiscriminator', [251, 248, 209, 245, 83, 234, 17, 27])
      .addFilter('owner', new PublicKey(owner))
      .addDataSizeFilter(209)
      .run(),
  ]);
  if (!userPositions.length) return [];

  const protocolPositions = await getParsedMultipleAccountsInfo(
    connection,
    protocolPositionStruct,
    userPositions.map((position) => position.protocol_position)
  );

  const poolStates = await getParsedMultipleAccountsInfo(
    connection,
    poolStateStruct,
    protocolPositions
      .map((position) => (position ? position.pool_address : []))
      .flat()
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  userPositions.forEach((userPosition) => {
    const protocolPosition = protocolPositions.find((p) =>
      p?.pubkey.equals(userPosition.protocol_position)
    );
    if (!protocolPosition) return;

    const pool = poolStates.find((p) =>
      p?.pubkey.equals(protocolPosition.pool_address)
    );
    if (!pool) return;

    const liquidityElement = elementRegistry.addElementConcentratedLiquidity({
      label: 'LiquidityPool',
      link: 'https://app.ensofi.xyz/portfolio',
    });

    liquidityElement.setLiquidity({
      addressA: pool.tokenMint0,
      addressB: pool.tokenMint1,
      liquidity: userPosition.liquidity,
      tickCurrentIndex: pool.tickCurrent,
      tickLowerIndex: protocolPosition.tick_lower_index,
      tickUpperIndex: protocolPosition.tick_upper_index,
      currentSqrtPrice: pool.sqrtPriceX64,
      ref: userPosition.pubkey,
      sourceRefs: [
        { name: 'Pool', address: pool.pubkey.toString() },
        { name: 'Vault', address: protocolPosition.pubkey.toString() },
      ],
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-solana-liquidity`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
