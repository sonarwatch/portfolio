import { BeetArgsStruct } from '@metaplex-foundation/beet';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import {
  OrderId,
  orderIdBeet,
  publicKeyBeet,
  restingOrderBeet,
  TraderState,
  traderStateBeet,
} from '../structs/misc';
import {
  marketHeaderStruct,
  partialMarketHeaderStruct,
} from '../structs/marketHeader';
import { Market } from '../types';
import { toBN } from '../../../utils/misc/toBN';

function getNodeIndices<Key, Value>(
  data: Buffer,
  keyDeserializer: BeetArgsStruct<Key>,
  valueDeserializer: BeetArgsStruct<Value>
): Map<Key, number> {
  const indexMap = new Map<Key, number>();
  const treeNodes = deserializeRedBlackTreeNodes(
    data,
    keyDeserializer,
    valueDeserializer
  );

  const nodes = treeNodes[0];
  const freeNodes = treeNodes[1];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [index, [key]] of nodes.entries()) {
    if (!freeNodes.has(index)) {
      indexMap.set(key, index + 1);
    }
  }

  return indexMap;
}

function getUiOrderSequenceNumber(orderId: OrderId): BN {
  const twosComplement = (toBN(orderId.orderSequenceNumber) as BN).fromTwos(64);
  return twosComplement.isNeg()
    ? twosComplement.neg().sub(new BN(1))
    : twosComplement;
}

function sign(n: BN) {
  if (n.lt(new BN(0))) {
    return -1;
  }
  if (n.gt(new BN(0))) {
    return 1;
  }
  return 0;
}

function deserializeRedBlackTree<Key, Value>(
  data: Buffer,
  keyDeserializer: BeetArgsStruct<Key>,
  valueDeserializer: BeetArgsStruct<Value>
): Map<Key, Value> {
  const tree = new Map<Key, Value>();
  const treeNodes = deserializeRedBlackTreeNodes(
    data,
    keyDeserializer,
    valueDeserializer
  );

  const nodes = treeNodes[0];
  const freeNodes = treeNodes[1];

  for (const [index, [key, value]] of nodes.entries()) {
    if (!freeNodes.has(index)) {
      tree.set(key, value);
    }
  }

  return tree;
}

function deserializeRedBlackTreeNodes<Key, Value>(
  data: Buffer,
  keyDeserializer: BeetArgsStruct<Key>,
  valueDeserializer: BeetArgsStruct<Value>
): [Array<[Key, Value]>, Set<number>] {
  let offset = 0;
  const keySize = keyDeserializer.byteSize;
  const valueSize = valueDeserializer.byteSize;

  const nodes = new Array<[Key, Value]>();

  // Skip RBTree header
  offset += 16;

  // Skip node allocator size
  offset += 8;
  const bumpIndex = data.readInt32LE(offset);
  offset += 4;
  let freeListHead = data.readInt32LE(offset);
  offset += 4;

  const freeListPointers = new Array<[number, number]>();

  for (let index = 0; offset < data.length && index < bumpIndex - 1; index++) {
    const registers = new Array<number>();
    for (let i = 0; i < 4; i++) {
      registers.push(data.readInt32LE(offset)); // skip padding
      offset += 4;
    }
    const [key] = keyDeserializer.deserialize(
      data.subarray(offset, offset + keySize)
    );
    offset += keySize;
    const [value] = valueDeserializer.deserialize(
      data.subarray(offset, offset + valueSize)
    );
    offset += valueSize;
    nodes.push([key, value]);
    freeListPointers.push([index, registers[0]]);
  }
  const freeNodes = new Set<number>();
  let indexToRemove = freeListHead - 1;

  let counter = 0;
  // If there's an infinite loop here, that means that the state is corrupted
  while (freeListHead < bumpIndex) {
    // We need to subtract 1 because the node allocator is 1-indexed
    [indexToRemove, freeListHead] = freeListPointers[freeListHead - 1];
    freeNodes.add(indexToRemove);
    counter += 1;
    if (counter > bumpIndex) {
      throw new Error('Infinite loop detected');
    }
  }

  return [nodes, freeNodes];
}

function getValueFromRedBlackTreeNodes<Value>(
  data: Buffer,
  key: Buffer,
  valueDeserializer: BeetArgsStruct<Value>
): Value | null {
  const keySize = key.byteLength;
  const valueSize = valueDeserializer.byteSize;
  let offset = 24;
  const bumpIndex = data.readInt32LE(offset);
  offset += 8;
  for (let index = 0; offset < data.length && index < bumpIndex - 1; index++) {
    const registers = new Array<number>();
    for (let i = 0; i < 4; i++) {
      registers.push(data.readInt32LE(offset)); // skip padding
      offset += 4;
    }
    const cKey = data.subarray(offset, offset + keySize);
    offset += keySize;
    if (cKey.equals(key)) {
      return valueDeserializer.deserialize(
        data.subarray(offset, offset + valueSize)
      )[0];
    }
    offset += valueSize;
  }
  return null;
}

export function deserializeMarketData(data: Buffer): Market {
  // Deserialize the market header
  let offset = marketHeaderStruct.byteSize;
  const [header] = marketHeaderStruct.deserialize(data.subarray(0, offset));

  // Parse market data
  const paddingLen = 8 * 32;
  let remaining = data.subarray(offset + paddingLen);
  offset = 0;
  const baseLotsPerBaseUnit = Number(remaining.readBigUInt64LE(offset));
  offset += 8;
  const quoteLotsPerBaseUnitPerTick = Number(remaining.readBigUInt64LE(offset));
  offset += 8;
  const sequenceNumber = Number(remaining.readBigUInt64LE(offset));
  offset += 8;
  const takerFeeBps = Number(remaining.readBigUInt64LE(offset));
  offset += 8;
  const collectedQuoteLotFees = Number(remaining.readBigUInt64LE(offset));
  offset += 8;
  const unclaimedQuoteLotFees = Number(remaining.readBigUInt64LE(offset));
  offset += 8;
  remaining = remaining.subarray(offset);

  // Parse bids, asks and traders
  const numBids = header.marketSizeParams.bidsSize.toNumber();
  const numAsks = header.marketSizeParams.asksSize.toNumber();
  const numTraders = header.marketSizeParams.numSeats.toNumber();

  const bidsSize =
    16 + 16 + (16 + orderIdBeet.byteSize + restingOrderBeet.byteSize) * numBids;
  const asksSize =
    16 + 16 + (16 + orderIdBeet.byteSize + restingOrderBeet.byteSize) * numAsks;
  const tradersSize =
    16 + 16 + (16 + 32 + traderStateBeet.byteSize) * numTraders;
  offset = 0;

  const bidBuffer = remaining.subarray(offset, offset + bidsSize);
  offset += bidsSize;
  const askBuffer = remaining.subarray(offset, offset + asksSize);
  offset += asksSize;
  const traderBuffer = remaining.subarray(offset, offset + tradersSize);

  const bidsUnsorted = deserializeRedBlackTree(
    bidBuffer,
    orderIdBeet,
    restingOrderBeet
  );

  const asksUnsorted = deserializeRedBlackTree(
    askBuffer,
    orderIdBeet,
    restingOrderBeet
  );

  // Sort bids in descending order of price, and ascending order of sequence number
  const bids = [...bidsUnsorted].sort((a, b) => {
    const priceComparison = sign(
      toBN(b[0].priceInTicks).sub(toBN(a[0].priceInTicks))
    );
    if (priceComparison !== 0) {
      return priceComparison;
    }
    return sign(
      getUiOrderSequenceNumber(a[0]).sub(getUiOrderSequenceNumber(b[0]))
    );
  });

  // Sort asks in ascending order of price, and ascending order of sequence number
  const asks = [...asksUnsorted].sort((a, b) => {
    const priceComparison = sign(
      toBN(a[0].priceInTicks).sub(toBN(b[0].priceInTicks))
    );
    if (priceComparison !== 0) {
      return priceComparison;
    }
    return sign(
      getUiOrderSequenceNumber(a[0]).sub(getUiOrderSequenceNumber(b[0]))
    );
  });

  const traders = new Map<string, TraderState>();
  for (const [k, traderState] of deserializeRedBlackTree(
    traderBuffer,
    publicKeyBeet,
    traderStateBeet
  )) {
    traders.set(k.publicKey.toString(), traderState);
  }

  const traderPubkeyToTraderIndex = new Map<string, number>();
  const traderIndexToTraderPubkey = new Map<number, string>();
  for (const [k, index] of getNodeIndices(
    traderBuffer,
    publicKeyBeet,
    traderStateBeet
  )) {
    traderPubkeyToTraderIndex.set(k.publicKey.toString(), index);
    traderIndexToTraderPubkey.set(index, k.publicKey.toString());
  }

  return {
    header,
    baseLotsPerBaseUnit,
    quoteLotsPerBaseUnitPerTick,
    orderSequenceNumber: sequenceNumber,
    takerFeeBps,
    collectedQuoteLotFees,
    unclaimedQuoteLotFees,
    bids,
    asks,
    traders,
    traderPubkeyToTraderIndex,
    traderIndexToTraderPubkey,
  };
}

export function getTraderState(
  data: Buffer,
  trader: string
): TraderState | null {
  // Deserialize the market header
  const [partialHeader] = partialMarketHeaderStruct.deserialize(data);
  const numBids = partialHeader.marketSizeParams.bidsSize.toNumber();
  const numAsks = partialHeader.marketSizeParams.asksSize.toNumber();
  const numTraders = partialHeader.marketSizeParams.numSeats.toNumber();
  const bidsSize =
    32 + (16 + orderIdBeet.byteSize + restingOrderBeet.byteSize) * numBids;
  const asksSize =
    32 + (16 + orderIdBeet.byteSize + restingOrderBeet.byteSize) * numAsks;
  const tradersSize = 32 + (48 + traderStateBeet.byteSize) * numTraders;
  const offset = marketHeaderStruct.byteSize + 304 + bidsSize + asksSize;
  const traderBuffer = data.subarray(offset, offset + tradersSize);

  return getValueFromRedBlackTreeNodes(
    traderBuffer,
    new PublicKey(trader).toBuffer(),
    traderStateBeet
  );
}
