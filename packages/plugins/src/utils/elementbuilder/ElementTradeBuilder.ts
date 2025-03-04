import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioElementTrade,
  PortfolioElementType,
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

  tokenAddresses(): string[] {
    if (!this.params) return [];

    const mints = [];
    if (this.params.inputAsset)
      mints.push(this.params.inputAsset.address.toString());
    if (this.params.outputAsset)
      mints.push(this.params.outputAsset.address.toString());
    return mints;
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElementTrade | null {
    if (!this.params) return null;

    if (
      (!this.params.inputAsset.amount ||
        this.params.inputAsset.amount?.toString() === '0') &&
      (!this.params.outputAsset.amount ||
        this.params.outputAsset.amount?.toString() === '0')
    )
      return null;

    const inputAmount = new BigNumber(this.params.inputAsset?.amount || 0);
    const outputAmount = new BigNumber(this.params.outputAsset?.amount || 0);

    const inputAsset = new AssetTokenBuilder({
      address: this.params.inputAsset.address.toString(),
      amount: inputAmount.toNumber(),
    }).get(networkId, tokenPrices);

    const outputAsset = new AssetTokenBuilder({
      address: this.params.outputAsset.address.toString(),
      amount: outputAmount.toNumber(),
    }).get(networkId, tokenPrices);

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
      type: PortfolioElementType.trade,
      name: this.name,
      tags: this.tags,
      data: {
        assets: {
          input: inputAsset,
          output: outputAsset,
        },
        inputAddress: this.params.inputAsset.address.toString(),
        outputAddress: this.params.outputAsset.address.toString(),
        initialInputAmount: initialInputAmount.toNumber(),
        withdrawnOutputAmount:
          this.params.withdrawnOutputAmount && outputPrice
            ? new BigNumber(this.params.withdrawnOutputAmount)
                .dividedBy(10 ** outputPrice.decimals)
                .toNumber()
            : 0,
        expectedOutputAmount:
          this.params.expectedOutputAmount && outputPrice
            ? new BigNumber(this.params.expectedOutputAmount)
                .dividedBy(10 ** outputPrice.decimals)
                .toNumber()
            : undefined,
        filledPercentage: new BigNumber(1)
          .minus(
            new BigNumber(inputAsset?.data.amount || 0).dividedBy(
              initialInputAmount
            )
          )
          .toNumber(),
        inputPrice: inputPrice.price,
        outputPrice: outputPrice?.price || null,
        createdAt: this.params?.createdAt,
        expireAt: this.params?.expireAt,
        ref: this.ref?.toString(),
        sourceRefs: this.sourceRefs,
        link: this.link,
      },
      value: getUsdValueSum([inputAsset?.value || 0, outputAsset?.value || 0]),
    };
  }
}
