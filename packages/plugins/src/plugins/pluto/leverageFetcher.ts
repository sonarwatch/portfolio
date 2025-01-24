import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, Yield } from "@sonarwatch/portfolio-core";
import { Fetcher, FetcherExecutor } from "../../Fetcher";
import { earnVaultsKey, leverageVaultKey, platformId } from "./constants";
import { getClientSolana } from "../../utils/clients";
import { Cache } from '../../Cache';
import { getElementLendingValues, getLeverage } from "./helper";
import tokenPriceToAssetToken from "../../utils/misc/tokenPriceToAssetToken";
import { EarnVault, LeverageData, LeverageVault, Position } from "./types";

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const leverage = await getLeverage(owner);
    const elements: PortfolioElement[] = [];

    if (leverage?.data) {
        const dataLeverage = leverage.data;
        for (const item of dataLeverage) {
            const suppliedAssets: PortfolioAsset[] = [];
            const borrowedAssets: PortfolioAsset[] = [];
            const suppliedLtvs: number[] = [];
            const borrowedWeights: number[] = [];
            const rewardAssets: PortfolioAsset[] = [];
            const borrowedYields: Yield[][] = [];
            const suppliedYields: Yield[][] = [];

            const leverageVault = await cache.getItem<LeverageVault>(item.symbol, {
                prefix: leverageVaultKey,
                networkId: NetworkId.solana,
            })
            if (!leverageVault) break;
            
            const earnVault = await cache.getItem<EarnVault>(leverageVault.earnName, {
                prefix: earnVaultsKey,
                networkId: NetworkId.solana,
            })
            if (!earnVault) break;

            const tokenPrice = await cache.getTokenPrice(leverageVault.tokenMintA, NetworkId.solana)

            for (const position of item.positions) {
                suppliedYields.push([{apy: Number(earnVault.supply_apy), apr: Number(0)}]);
                suppliedAssets.push(
                    tokenPriceToAssetToken(
                        leverageVault.tokenMintA,
                        Number(position.collateral_amount),
                        NetworkId.solana,
                        tokenPrice,
                    )
                )

                borrowedYields.push([{apy: Number(earnVault.borrow_apy), apr: Number(0)}]);
                borrowedAssets.push(
                    tokenPriceToAssetToken(
                        leverageVault.tokenMintA,
                        Number(position.borrowing_amount),
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
                name: `Leveraged ${item.symbol.replace("-", "/")}`,
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
    }

    return elements;
};

const fetcher: Fetcher = {
    id: `${platformId}-leverage`,
    networkId: NetworkId.solana,
    executor,
}

export default fetcher;