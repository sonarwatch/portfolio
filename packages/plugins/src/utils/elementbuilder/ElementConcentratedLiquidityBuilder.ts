import BigNumber from 'bignumber.js';
import {
  NetworkIdType,
  PortfolioElementLiquidity,
  yieldFromApr,
} from '@sonarwatch/portfolio-core';
import { ElementLiquidityBuilder } from './ElementLiquidityBuilder';
import { LiquidityBuilder } from './LiquidityBuilder';
import { getTokenAmountsFromLiquidity } from '../clmm/tokenAmountFromLiquidity';
import { estPositionAPRWithDeltaMethod } from '../clmm/estPositionAPRWithDeltaMethod';
import { toBN } from '../misc/toBN';
import { TokenPriceMap } from '../../TokenPriceMap';
import { ConcentratedLiquidityParams, LiquidityParams } from './Params';

export class ElementConcentratedLiquidityBuilder extends ElementLiquidityBuilder {
  concentratedLiquidityParams?: ConcentratedLiquidityParams;

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-shadow,@typescript-eslint/no-unused-vars
  override addLiquidity(params?: LiquidityParams): LiquidityBuilder {
    throw new Error('Use setLiquidity for ElementConcentratedLiquidityBuilder');
  }

  setLiquidity(params: ConcentratedLiquidityParams) {
    this.concentratedLiquidityParams = params;
    const liquidityBuilder = new LiquidityBuilder({
      name: params.name,
      ref: params.ref,
      sourceRefs: params.sourceRefs,
      link: params.link,
    });
    this.liquidities = [liquidityBuilder];
    return liquidityBuilder;
  }

  override tokenAddresses(): string[] {
    const mints = this.liquidities.map((liquidity) => liquidity.mints()).flat();
    if (this.concentratedLiquidityParams?.addressA)
      mints.push(this.concentratedLiquidityParams.addressA.toString());
    if (this.concentratedLiquidityParams?.addressB)
      mints.push(this.concentratedLiquidityParams.addressB.toString());
    return mints;
  }

  override get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElementLiquidity | null {
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
      this.concentratedLiquidityParams.swapVolume24h &&
      this.concentratedLiquidityParams.poolLiquidity
    ) {
      if (tokenAmountA.gt(0) && tokenAmountB.gt(0)) {
        const tokenPriceA = tokenPrices.get(
          this.concentratedLiquidityParams.addressA.toString()
        );
        const tokenPriceB = tokenPrices.get(
          this.concentratedLiquidityParams.addressB.toString()
        );

        if (tokenPriceA && tokenPriceB) {
          const { feeAPR } = estPositionAPRWithDeltaMethod(
            Number(
              this.concentratedLiquidityParams.tickCurrentIndex.toString()
            ),
            Number(this.concentratedLiquidityParams.tickLowerIndex.toString()),
            Number(this.concentratedLiquidityParams.tickUpperIndex.toString()),
            toBN(this.concentratedLiquidityParams.currentSqrtPrice),
            toBN(this.concentratedLiquidityParams.poolLiquidity),
            tokenPriceA.decimals,
            tokenPriceB.decimals,
            Number(this.concentratedLiquidityParams.feeRate.toString()),
            `${tokenAmountA.dividedBy(10 ** tokenPriceA.decimals)}`,
            `${tokenAmountB.dividedBy(10 ** tokenPriceB.decimals)}`,
            `${this.concentratedLiquidityParams.swapVolume24h}`,
            `${tokenPriceA.price}`,
            `${tokenPriceB.price}`
          );

          if (feeAPR && Number(feeAPR) >= 0) {
            liquidityBuilder.addYield(yieldFromApr(Number(feeAPR) / 100));
          }
        } else {
          liquidityBuilder.addYield(yieldFromApr(0));
        }
      }
    }

    if (tokenAmountA.isZero() || tokenAmountB.isZero())
      this.addTag('Out Of Range');

    return super.get(networkId, platformId, tokenPrices);
  }
}
