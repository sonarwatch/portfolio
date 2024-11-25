import BigNumber from 'bignumber.js';
import {
  aprToApy,
  NetworkIdType,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { ConcentratedLiquidityParams } from './ConcentratedLiquidityParams';
import { ElementLiquidityBuilder } from './ElementLiquidityBuilder';
import { LiquidityParams } from './LiquidityParams';
import { LiquidityBuilder } from './LiquidityBuilder';
import { getTokenAmountsFromLiquidity } from '../clmm/tokenAmountFromLiquidity';
import { estPositionAPRWithDeltaMethod } from '../clmm/estPositionAPRWithDeltaMethod';
import { toBN } from '../misc/toBN';
import { TokenPriceMap } from '../../TokenPriceMap';

export class ElementConcentratedLiquidityBuilder extends ElementLiquidityBuilder {
  concentratedLiquidityParams?: ConcentratedLiquidityParams;

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-shadow,@typescript-eslint/no-unused-vars
  override addLiquidity(params?: LiquidityParams): LiquidityBuilder {
    throw new Error('Use setLiquidity for ElementConcentratedLiquidityBuilder');
  }

  setLiquidity(params: ConcentratedLiquidityParams) {
    this.concentratedLiquidityParams = params;
    const liquidityBuilder = new LiquidityBuilder({ name: params.name });
    this.liquidities = [liquidityBuilder];
    return liquidityBuilder;
  }

  override get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null {
    if (!this.liquidities[0] || !this.concentratedLiquidityParams) return null;

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(this.concentratedLiquidityParams.liquidity),
      Number(this.concentratedLiquidityParams.tickCurrentIndex.toString()),
      Number(this.concentratedLiquidityParams.tickLowerIndex.toString()),
      Number(this.concentratedLiquidityParams.tickUpperIndex.toString()),
      this.concentratedLiquidityParams.roundUp || false
    );

    const liquidityBuilder = this.liquidities[0];

    liquidityBuilder.addAsset({
      address: this.concentratedLiquidityParams.addressA,
      amount: tokenAmountA,
    });

    liquidityBuilder.addAsset({
      address: this.concentratedLiquidityParams.addressB,
      amount: tokenAmountB,
    });

    if (
      this.concentratedLiquidityParams.feeRate &&
      this.concentratedLiquidityParams.currentSqrtPrice &&
      this.concentratedLiquidityParams.swapVolume24h
    ) {
      const tokenPriceA = tokenPrices.get(
        this.concentratedLiquidityParams.addressA.toString()
      );
      const tokenPriceB = tokenPrices.get(
        this.concentratedLiquidityParams.addressB.toString()
      );

      if (tokenPriceA && tokenPriceB) {
        const { feeAPR } = estPositionAPRWithDeltaMethod(
          Number(this.concentratedLiquidityParams.tickCurrentIndex.toString()),
          Number(this.concentratedLiquidityParams.tickLowerIndex.toString()),
          Number(this.concentratedLiquidityParams.tickUpperIndex.toString()),
          toBN(this.concentratedLiquidityParams.currentSqrtPrice),
          toBN(this.concentratedLiquidityParams.liquidity),
          tokenPriceA.decimals,
          tokenPriceB.decimals,
          Number(this.concentratedLiquidityParams.feeRate.toString()),
          `${tokenAmountA}`,
          `${tokenAmountB}`,
          `${this.concentratedLiquidityParams.swapVolume24h}`,
          `${tokenPriceA.price}`,
          `${tokenPriceB.price}`
        );

        if (feeAPR) {
          liquidityBuilder.addYield({
            apy: aprToApy(Number(feeAPR)),
            apr: Number(feeAPR),
          });
        }
      }
    }

    if (tokenAmountA.isZero() || tokenAmountB.isZero())
      this.addTag('Out Of Range');

    return super.get(networkId, platformId, tokenPrices);
  }
}
