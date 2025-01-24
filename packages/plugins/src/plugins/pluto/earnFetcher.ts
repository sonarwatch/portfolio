import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, Yield } from "@sonarwatch/portfolio-core";
import { Fetcher, FetcherExecutor } from "../../Fetcher";
import { earnVaultsKey, leverageVaultKey, platformId } from "./constants";
import { getClientSolana } from "../../utils/clients";
import { Cache } from '../../Cache';
import { getEarn, getElementLendingValues } from "./helper";
import { EarnVault, LeverageVault } from "./types";
import tokenPriceToAssetToken from "../../utils/misc/tokenPriceToAssetToken";

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const earn = await getEarn(owner);
    const elements: PortfolioElement[] = [];

    if (earn?.data) {
        const dataEarn = earn.data;
        const suppliedAssets: PortfolioAsset[] = [];
        const borrowedAssets: PortfolioAsset[] = [];
        const suppliedLtvs: number[] = [];
        const borrowedWeights: number[] = [];
        const rewardAssets: PortfolioAsset[] = [];
        const borrowedYields: Yield[][] = [];
        const suppliedYields: Yield[][] = [];
        for (const item of dataEarn) {
            
            const leverageVault = await cache.getItem<LeverageVault>(item.symbol, {
                prefix: leverageVaultKey,
                networkId: NetworkId.solana,
            })
            if (!leverageVault) break;

            const earnVault = await cache.getItem<EarnVault>(item.symbol, {
                prefix: earnVaultsKey,
                networkId: NetworkId.solana,
            })
            if (!earnVault) break;

            const tokenPrice = await cache.getTokenPrice(leverageVault.tokenMintA, NetworkId.solana);

            suppliedYields.push([{apy: Number(earnVault.supply_apy_7d), apr: Number(0)}]);
            suppliedAssets.push(
                tokenPriceToAssetToken(
                    leverageVault.tokenMintA,
                    Number(item.amount),
                    NetworkId.solana,
                    tokenPrice,
                )
            )
        }
        
        let { borrowedValue, suppliedValue, value, rewardValue } =
        getElementLendingValues({
            suppliedAssets,
            borrowedAssets,
            rewardAssets,
        });

        
        elements.push({
            name: `Earn`,
            type: PortfolioElementType.borrowlend,
            networkId: NetworkId.solana,
            platformId,
            label: 'Lending',
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
    id: `${platformId}-earn`,
    networkId: NetworkId.solana,
    executor,
}

export default fetcher;