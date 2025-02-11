import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, Yield } from "@sonarwatch/portfolio-core";
import { Fetcher, FetcherExecutor } from "../../Fetcher";
import { earnVaultsKey, leverageVaultKey, platformId } from "./constants";
import { getClientSolana } from "../../utils/clients";
import { Cache } from '../../Cache';
import { getAllEarn, getAllEarnLender, getElementLendingValues } from "./helper";
import { EarnVault, LeverageVault } from "./types";
import tokenPriceToAssetToken from "../../utils/misc/tokenPriceToAssetToken";

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getClientSolana();  
    const earn = await getAllEarn(client)
    const elements: PortfolioElement[] = [];

    const suppliedAssets: PortfolioAsset[] = [];
    const borrowedAssets: PortfolioAsset[] = [];
    const suppliedLtvs: number[] = [];
    const borrowedWeights: number[] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedYields: Yield[][] = [];
    for (const item of earn) {
        const earnLenders = await getAllEarnLender(client, owner, item.pubkey.toString())
        if (earnLenders.length == 0) {
          continue;
        }

        const tokenPrice = await cache.getTokenPrice(item.tokenMint.toString(), NetworkId.solana);
        const apy = Number(item.apy.ema7d / 1e5)
        suppliedYields.push([{apy: apy, apr: apy}]);

        const earnLender = earnLenders[0];
        const earnUnit = earnLender.unit.toNumber() / 1e8; // Convert BigNumber to JS number (losing precision)
        const earnIndex = item.index.toNumber() / 1e12; // Convert index to JS number
        const earnAmount = earnUnit * earnIndex; // Use regular JS math
        suppliedAssets.push(
            tokenPriceToAssetToken(
                item.tokenMint.toString(),
                earnAmount,
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

    return elements;
};

const fetcher: Fetcher = {
    id: `${platformId}-earn`,
    networkId: NetworkId.solana,
    executor,
}

export default fetcher;
