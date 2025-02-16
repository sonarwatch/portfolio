import BigNumber from 'bignumber.js';
import { ParsedAccount } from '../../utils/solana';
import { MarketV2, Order, OrderDirection } from './structs';

export const calculatePnL = (
  market: ParsedAccount<MarketV2> | undefined,
  order: Order
) => {
  if (!market || order.price.isZero()) return 0;

  let currentLiquidity;
  let currentPrice;

  if (order.direction === OrderDirection.Hype) {
    currentLiquidity = new BigNumber(market.hype_liquidity).shiftedBy(-6);
    currentPrice = new BigNumber(market.hype_price);
  } else {
    currentLiquidity = new BigNumber(market.flop_liquidity).shiftedBy(-6);
    currentPrice = new BigNumber(market.flop_price);
  }

  const shares = order.total_shares.shiftedBy(-6);

  const currentPayout = shares.multipliedBy(currentPrice);
  /* const impactFactor = currentPayout.dividedBy(currentLiquidity.plus(1));
  const priceImpact = Math.min(impactFactor.multipliedBy(0.16).toNumber(), 0.5); */
  const priceImpact = 0;

  const takerFee = 1.042;

  return currentPayout
    .multipliedBy(1 - priceImpact)
    .dividedBy(takerFee)
    .minus(order.total_amount);
};
