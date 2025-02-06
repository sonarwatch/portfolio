import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioElement,
  PortfolioElementTrade,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { ElementBuilder } from './ElementBuilder';
import { Params, TradeParams } from './Params';
import { TokenPriceMap } from '../../TokenPriceMap';
import { AssetTokenBuilder } from './AssetTokenBuilder';

export class ElementTradeBuilder extends ElementBuilder {
  params?: TradeParams;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(params: Params) {
    super(params);
  }

  setTrade(params: TradeParams) {
    this.params = params;
  }

  mints(): string[] {
    const mints = [];
    if (this.params?.inputAsset)
      mints.push(...new AssetTokenBuilder(this.params.inputAsset).mints());
    if (this.params?.outputAsset)
      mints.push(this.params.outputAsset.address.toString());
    return mints;
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null {
    if (!this.params) return null;
    const inputAsset = new AssetTokenBuilder(this.params.inputAsset).get(
      networkId,
      tokenPrices
    );

    if (!inputAsset?.data.amount) return null;

    const outputAmount = new BigNumber(this.params.initialInputAmount).minus(
      this.params.expectedOutputAmount || 0
    );
    const outputAsset = outputAmount.gt(0)
      ? new AssetTokenBuilder({
          address: this.params.outputAsset.toString(),
          amount: outputAmount,
        }).get(networkId, tokenPrices)
      : null;

    const inputPrice = tokenPrices.get(
      this.params.inputAsset.address.toString()
    );
    const outputPrice = tokenPrices.get(
      this.params.outputAsset.address.toString()
    );

    if (!inputPrice) return null;

    const initialInputAmount = new BigNumber(
      this.params.initialInputAmount
    ).dividedBy(10 ** inputPrice.decimals);

    return {
      networkId,
      label: this.label,
      platformId,
      type: this.type,
      name: this.name,
      tags: this.tags,
      data: {
        assets: {
          input: inputAsset,
          output: outputAsset,
        },
        inputAddress: inputAsset.data.address,
        outputAddress: this.params.outputAsset.address.toString(),
        initialInputAmount: initialInputAmount.toNumber(),
        expectedOutputAmount:
          this.params.expectedOutputAmount && outputPrice
            ? new BigNumber(this.params.expectedOutputAmount)
                .dividedBy(10 ** outputPrice.decimals)
                .toNumber()
            : null,
        filledPercentage: new BigNumber(1)
          .minus(
            new BigNumber(inputAsset.data.amount).dividedBy(initialInputAmount)
          )
          .toNumber(),
        inputPrice: inputPrice?.price,
        outputPrice: outputPrice?.price,
      },
      value: getUsdValueSum([inputAsset.value, outputAsset?.value || 0]),
      ref: this.ref?.toString(),
      sourceRefs: this.sourceRefs,
      link: this.link,
    } as PortfolioElementTrade;
  }
}
