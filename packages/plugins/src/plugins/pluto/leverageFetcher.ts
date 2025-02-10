import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, Yield } from "@sonarwatch/portfolio-core";
import { Fetcher, FetcherExecutor } from "../../Fetcher";
import { earnVaultsKey, leverageVaultKey, platformId } from "./constants";
import { getClientSolana } from "../../utils/clients";
import { Cache } from '../../Cache';
import { getAllLeverage, getAllLeverageObligation, getElementLendingValues } from "./helper";
import tokenPriceToAssetToken from "../../utils/misc/tokenPriceToAssetToken";
import { EarnVault, LeverageData, LeverageVault, Position } from "./types";

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getClientSolana();  
    const leverage = await getAllLeverage(client);
    const elements: PortfolioElement[] = [];

    const dataLeverage = leverage;
    
    for (const item of dataLeverage) {
        const suppliedAssets: PortfolioAsset[] = [];
        const borrowedAssets: PortfolioAsset[] = [];
        const suppliedLtvs: number[] = [];
        const borrowedWeights: number[] = [];
        const rewardAssets: PortfolioAsset[] = [];
        const borrowedYields: Yield[][] = [];
        const suppliedYields: Yield[][] = [];

        const obligations = await getAllLeverageObligation(client, owner, item.pubkey.toString());
        if (obligations.length == 0) {
          continue;
        }
        const obligation = obligations[0]

        const tokenPrice = await cache.getTokenPrice(item.tokenCollateralTokenMint.toString(), NetworkId.solana)

        for (const position of obligation.positions) {
            if (position.unit.toString() === '0') {
              continue;
            }

            const pos = position.number;
            const unit = position.unit.toNumber() / 1e8;
            const tokenCollateralAmount = position.token_collateral_amount.shiftedBy(-position.token_collateral_price_exponent).toNumber()
            const borrowingUnit = position.borrowing_unit.toNumber() / 1e8;
            const borrowingIndex = item.borrowingIndex / 1e12;
            const borrowingAmount = borrowingUnit * borrowingIndex;
            const index = item.index / 1e12;
            const amount = unit * index;
            // console.log(pos, unit, tokenCollateralAmount, borrowingUnit, borrowingAmount, index, amount);

            suppliedYields.push([{apy: Number(item.apy.ema7d / 1e3), apr: Number(item.apy.ema7d / 1e3)}]);
            suppliedAssets.push(
                tokenPriceToAssetToken(
                    item.tokenCollateralTokenMint.toString(),
                    Number(amount),
                    NetworkId.solana,
                    tokenPrice,
                )
            )

            borrowedYields.push([{apy: Number(item.borrowingApy.ema7d / 1e3), apr: Number(item.borrowingApy.ema7d / 1e3)}]);
            borrowedAssets.push(
                tokenPriceToAssetToken(
                    item.tokenCollateralTokenMint.toString(),
                    Number(borrowingAmount),
                    NetworkId.solana,
                    tokenPrice,
                )
            )
        }
        
        if (suppliedAssets.length === 0 && borrowedAssets.length === 0) break;
        
        let { borrowedValue, suppliedValue, value, rewardValue } =
        getElementLendingValues({
            suppliedAssets,
            borrowedAssets,
            rewardAssets,
        });

        elements.push({
            name: `Leveraged`,
            type: PortfolioElementType.borrowlend,
            networkId: NetworkId.solana,
            platformId,
            label: 'Leverage',
            value,
            data: {
                borrowedAssets,
                borrowedValue,
                borrowedYields,
                suppliedAssets,
                suppliedValue,
                suppliedYields,
                healthRatio: null,
                rewardAssets,
                rewardValue,
                value,
            }
        })
    }

    return elements;
};

const fetcher: Fetcher = {
    id: `${platformId}-leverage`,
    networkId: NetworkId.solana,
    executor,
}

export default fetcher;
