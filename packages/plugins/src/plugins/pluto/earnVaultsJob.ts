import { NetworkId } from "@sonarwatch/portfolio-core";
import { Cache } from "../../Cache";
import { Job, JobExecutor } from "../../Job";
import { earnVaultsKey, platformId } from "./constants";
import { getEarnVaults } from "./helper";

const executor: JobExecutor = async (cache: Cache) => {
    const earnVaults = await getEarnVaults();
    const storedEarnVault: {
        key: string;
        value: any;
    }[] = [];

    if (earnVaults?.data) {
        const earnVaultData = earnVaults.data;
        earnVaultData?.forEach((item: any) => {
            storedEarnVault.push({
                key: item.symbol,
                value: item,
            })
        })

        await cache.setItems(storedEarnVault, {
            prefix: earnVaultsKey,
            networkId: NetworkId.solana,
        })
    }
};

const job: Job = {
    id: `${platformId}-earn-vault`,
    executor,
    label: 'normal',
}
export default job;