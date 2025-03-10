import BigNumber from 'bignumber.js';
import { ParsedAccount } from '../../utils/solana';
import { MarketV2, Order, OrderDirection } from './structs';

export const calculatePnL = (
  market: ParsedAccount<MarketV2> | undefined,
  order: Order
) => {
  if (!market || order.price.isZero()) return 0;

  const marketPrice = new BigNumber(
    order.direction === OrderDirection.Hype
      ? market.hype_price
      : market.flop_price
  );

  const currentLiquidity = new BigNumber(
    order.direction === OrderDirection.Hype
      ? market.hype_liquidity
      : market.flop_liquidity
  ).shiftedBy(-6);

  const payout = order.total_shares.shiftedBy(-6).multipliedBy(marketPrice);

  const impactFactor = payout.dividedBy(currentLiquidity.shiftedBy(6).plus(1));
  const priceImpact = Math.min(impactFactor.multipliedBy(0.16).toNumber(), 0.5);

  const takerFee = 1.042;

  const orderPriceWithImpact = marketPrice
    .multipliedBy(1 - priceImpact)
    .dividedBy(takerFee);

  return order.total_shares
    .shiftedBy(-6)
    .multipliedBy(orderPriceWithImpact)
    .minus(order.total_amount);
};
