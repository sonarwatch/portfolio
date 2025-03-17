import {
  NetworkId,
  NetworkIdType,
  TokenPriceSource,
  networks,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import getSourceWeight from './getSourceWeight';
import { getCachedDecimalsForToken } from './getCachedDecimalsForToken';
import { walletTokensPlatform } from '../../plugins/tokens/constants';
import { usdcSolanaMint } from '../solana';
import { mSOLMint } from '../../plugins/marinade/constants';
import { jitoSOLMint } from '../../plugins/jito/constants';

export type TokenInfo = {
  mint: string;
  decimal?: number;
  rawReserve: BigNumber;
};

export type PartialTokenUnderlying = {
  networkId: NetworkIdType;
  address: string;
  decimals: number;
  price: number;
};

/**
 * @deprecated
 * This function has been deprecated. Use the getLpUnderlyingTokenSource instead.
 * This list is used to avoid calulating low liquidity tokens with others low liquidity tokens.
 * To prevent wrong prices (with very low precision) to be calculated, we setup a list of tokens to rely on.
 * These tokens have very low chance of having price manipulation.
 * Therefore, they can be safely used to compute other tokens prices.
 *
 * If you think other tokens should be added to this list, please send a PR.
 */
export const tokensToRelyOnByNetwork: Map<NetworkIdType, string[]> = new Map([
  [
    NetworkId.sei,
    [
      networks.sei.native.address,
      'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518', // OSMO
      'factory/sei189adguawugk3e55zn63z8r9ll29xrjwca636ra7v7gxuzn98sxyqwzt47l/Hq4tuDzhRBnxw3tFA5n6M52NVMVcC19XggbyDiJKCD6H', // USDCet
    ],
  ],
  [
    NetworkId.solana,
    [
      networks.solana.native.address,
      solanaNativeWrappedAddress, // WSOL
      jitoSOLMint, // jito SOL
      mSOLMint, // mSOL
      '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', // lido SOL
      usdcSolanaMint, // USDC
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    ],
  ],
  [
    NetworkId.aptos,
    [
      networks.aptos.native.address,
      '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T', // USDCet
      '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD', // MOD (Move Dollar)
    ],
  ],
  [
    NetworkId.sui,
    [
      networks.sui.native.address,
      '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN', // USDCet
      '0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS', // CETUS
      '0x2::sui::SUI',
    ],
  ],
]);

/**
 * @deprecated
 * This function has been deprecated. Use the getLpUnderlyingTokenSource instead.
 * This list is used to avoid calulating low liquidity tokens with others low liquidity tokens.
 * To prevent wrong prices (with very low precision) to be calculated, we setup a list of tokens to rely on.
 * These tokens have very low chance of having price manipulation.
 * Therefore, they can be safely used to compute other tokens prices.
 */
export default async function checkComputeAndStoreTokensPrices(
  cache: Cache,
  source: string,
  networkId: NetworkIdType,
  tokenX: TokenInfo,
  tokenY: TokenInfo
): Promise<
  | {
      partialTokenUnderlyingX: PartialTokenUnderlying;
      partialTokenUnderlyingY: PartialTokenUnderlying;
    }
  | undefined
> {
  const tokensToRelyOn = tokensToRelyOnByNetwork.get(networkId);

  if (!tokensToRelyOn) return undefined;

  if (
    !tokensToRelyOn.includes(tokenX.mint) &&
    !tokensToRelyOn.includes(tokenY.mint)
  )
    return undefined;

  const tokenPrices = await cache.getTokenPrices(
    [tokenX.mint, tokenY.mint],
    networkId
  );
  const tokenPriceX = tokenPrices[0];
  const tokenPriceY = tokenPrices[1];
  if (!tokenPriceX && !tokenPriceY) return undefined;

  let partialTokenUnderlyingX;
  let partialTokenUnderlyingY;

  if (tokenPriceX && tokenPriceY) {
    partialTokenUnderlyingX = {
      networkId,
      address: tokenX.mint,
      decimals: tokenPriceX.decimals,
      price: tokenPriceX.price,
    };

    partialTokenUnderlyingY = {
      networkId,
      address: tokenY.mint,
      decimals: tokenPriceY.decimals,
      price: tokenPriceY.price,
    };
    return { partialTokenUnderlyingX, partialTokenUnderlyingY };
  }

  if (!tokenPriceX || !tokenPriceY) {
    let decimalsTokenX: number | null;
    if (tokenX.decimal) {
      decimalsTokenX = tokenX.decimal;
    } else if (tokenPriceX) {
      decimalsTokenX = tokenPriceX.decimals;
    } else {
      decimalsTokenX = await getCachedDecimalsForToken(
        cache,
        tokenX.mint,
        networkId
      );
    }

    let decimalsTokenY;
    if (tokenY.decimal) {
      decimalsTokenY = tokenY.decimal;
    } else if (tokenPriceY) {
      decimalsTokenY = tokenPriceY.decimals;
    } else {
      decimalsTokenY = await getCachedDecimalsForToken(
        cache,
        tokenY.mint,
        networkId
      );
    }

    if (decimalsTokenX === null || decimalsTokenY === null) return undefined;

    const tokenXReserve = tokenX.rawReserve.dividedBy(10 ** decimalsTokenX);
    const tokenYReserve = tokenY.rawReserve.dividedBy(10 ** decimalsTokenY);

    let priceX: number;
    let priceY: number;

    if (!tokenPriceX && tokenPriceY) {
      priceX = tokenYReserve
        .multipliedBy(tokenPriceY.price)
        .dividedBy(tokenXReserve)
        .toNumber();
      priceY = tokenPriceY.price;
    } else if (!tokenPriceY && tokenPriceX) {
      priceX = tokenPriceX.price;
      priceY = tokenXReserve
        .multipliedBy(tokenPriceX.price)
        .dividedBy(tokenYReserve)
        .toNumber();
    } else {
      return undefined;
    }

    const weight = getSourceWeight(
      tokenXReserve.multipliedBy(priceX).multipliedBy(2)
    );

    const address = tokenPriceX ? tokenY.mint : tokenX.mint;
    const price = tokenPriceX ? priceY : priceX;
    const decimals = tokenPriceX ? decimalsTokenY : decimalsTokenX;
    if (decimals === undefined) return undefined;

    const tokenPriceSourceDest: TokenPriceSource = {
      id: source,
      weight,
      address,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals,
      price,
      timestamp: Date.now(),
    };

    partialTokenUnderlyingX = {
      networkId,
      address: tokenX.mint,
      decimals: decimalsTokenX,
      price: priceX,
    };

    partialTokenUnderlyingY = {
      networkId,
      address: tokenY.mint,
      decimals: decimalsTokenY,
      price: priceY,
    };

    await cache.setTokenPriceSource(tokenPriceSourceDest);
    return { partialTokenUnderlyingX, partialTokenUnderlyingY };
  }
  return undefined;
}
