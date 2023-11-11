import {
  NetworkIdType,
  TokenPrice,
  TokenPriceSource,
  aptosNativeAddress,
  coingeckoSourceId,
  seiNativeAddress,
  solanaNativeAddress,
  solanaNativeWrappedAddress,
  suiNativeAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import getSourceWeight from './getSourceWeight';
import { walletTokensPlatform } from '../../plugins/tokens/constants';

export type PoolData = {
  id: string;
  supply: BigNumber;
  lpDecimals: number;
  reserveTokenX: BigNumber;
  reserveTokenY: BigNumber;
  mintTokenX: string;
  decimalX?: number;
  mintTokenY: string;
  decimalY?: number;
};

type PoolUnderlyingRaw = {
  address: string;
  reserveAmountRaw: BigNumber;
  decimals: number;
  tokenPrice: TokenPrice | undefined;
};

type KnownPoolUnderlyingRaw = PoolUnderlyingRaw & {
  tokenPrice: TokenPrice;
};

const defaultAcceptedPairs = [
  // Sei Addresses
  seiNativeAddress,
  'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518', // OSMO
  'factory/sei189adguawugk3e55zn63z8r9ll29xrjwca636ra7v7gxuzn98sxyqwzt47l/Hq4tuDzhRBnxw3tFA5n6M52NVMVcC19XggbyDiJKCD6H', // USDCet
  // Solana Addresses
  solanaNativeAddress,
  solanaNativeWrappedAddress,
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  // Aptos Addresses
  aptosNativeAddress,
  '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T', // USDCet
  '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD', // MOD (Move Dollar)
  // Sui addresses
  suiNativeAddress,
  '0x2::sui::SUI',
  '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN', // USDCet
  '0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS', // CETUS
];

export default function getLpUnderlyingTokenSource(
  sourceId: string,
  platformId: string,
  networkId: NetworkIdType,
  poolUnderlyingsA: PoolUnderlyingRaw,
  poolUnderlyingsB: PoolUnderlyingRaw,
  minTvl = 5000,
  acceptedPairs = defaultAcceptedPairs
): TokenPriceSource | null {
  if (!poolUnderlyingsA.tokenPrice && !poolUnderlyingsB.tokenPrice) return null;
  if (poolUnderlyingsA.tokenPrice?.price === 0) return null;
  if (poolUnderlyingsB.tokenPrice?.price === 0) return null;

  const isAcceptedTokenA = acceptedPairs.includes(poolUnderlyingsA.address);
  const isAcceptedTokenB = acceptedPairs.includes(poolUnderlyingsB.address);
  if (isAcceptedTokenA && isAcceptedTokenB) return null;

  let knownUnderlaying: KnownPoolUnderlyingRaw | undefined;
  let unknownUnderlaying: PoolUnderlyingRaw | undefined;
  if (poolUnderlyingsA.tokenPrice && isAcceptedTokenA) {
    knownUnderlaying = poolUnderlyingsA as KnownPoolUnderlyingRaw;
    unknownUnderlaying = poolUnderlyingsB as KnownPoolUnderlyingRaw;
  } else if (poolUnderlyingsB.tokenPrice && isAcceptedTokenB) {
    knownUnderlaying = poolUnderlyingsB as KnownPoolUnderlyingRaw;
    unknownUnderlaying = poolUnderlyingsA as KnownPoolUnderlyingRaw;
  }
  if (!knownUnderlaying || !unknownUnderlaying) return null;
  if (
    unknownUnderlaying.tokenPrice &&
    unknownUnderlaying.tokenPrice.sources.some(
      (source) => source.id === coingeckoSourceId
    )
  ) {
    return null;
  }

  const knownReserveAmount = knownUnderlaying.reserveAmountRaw
    .div(10 ** knownUnderlaying.decimals)
    .toNumber();
  const knownReserveValue =
    knownReserveAmount * knownUnderlaying.tokenPrice.price;
  const poolTvl = knownReserveValue * 2;
  if (minTvl > poolTvl) return null;

  const unknownReserveAmount = unknownUnderlaying.reserveAmountRaw
    .div(10 ** unknownUnderlaying.decimals)
    .toNumber();
  const price = knownReserveValue / unknownReserveAmount;

  const source: TokenPriceSource = {
    id: sourceId,
    networkId,
    platformId: walletTokensPlatform.id,
    address: unknownUnderlaying.address,
    decimals: unknownUnderlaying.decimals,
    price,
    weight: getSourceWeight(poolTvl),
    timestamp: Date.now(),
  };
  return source;
}
