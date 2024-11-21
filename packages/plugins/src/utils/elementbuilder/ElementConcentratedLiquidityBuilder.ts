import BigNumber from 'bignumber.js';
import { ConcentratedLiquidityParams } from './ConcentratedLiquidityParams';
import { ElementLiquidityBuilder } from './ElementLiquidityBuilder';
import { LiquidityParams } from './LiquidityParams';
import { LiquidityBuilder } from './LiquidityBuilder';
import { getTokenAmountsFromLiquidity } from '../clmm/tokenAmountFromLiquidity';

export class ElementConcentratedLiquidityBuilder extends ElementLiquidityBuilder {
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-shadow,@typescript-eslint/no-unused-vars
  override addLiquidity(params?: LiquidityParams): LiquidityBuilder {
    throw new Error('Use setLiquidity for ElementConcentratedLiquidityBuilder');
  }

  setLiquidity(params: ConcentratedLiquidityParams) {
    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(params.liquidity),
      Number(params.tickCurrentIndex.toString()),
      Number(params.tickLowerIndex.toString()),
      Number(params.tickUpperIndex.toString()),
      params.roundUp || false
    );

    const liquidityBuilder = new LiquidityBuilder();

    liquidityBuilder.addAsset({
      address: params.addressA,
      amount: tokenAmountA,
    });

    liquidityBuilder.addAsset({
      address: params.addressB,
      amount: tokenAmountB,
    });

    if (tokenAmountA.isZero() || tokenAmountB.isZero())
      this.addTag('Out Of Range');

    this.liquidities = [liquidityBuilder];
    return liquidityBuilder;
  }
}
