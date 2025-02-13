import { Job, JobExecutor } from "../../Job";
import { leverageVaultAddressesKey, platformId } from "./constants";
import { Cache } from '../../Cache';
import { getLeverageVaults } from "./helper";
import { NetworkId } from "@sonarwatch/portfolio-core";
import { LeverageVaultAddress } from "./structs";

const executor: JobExecutor = async (cache: Cache) => {
    const leverageVault = await getLeverageVaults();
    if (leverageVault?.production) {
        const items: LeverageVaultAddress[] = []
        const productionData = leverageVault.production;
        for (const key in productionData) {
            if (productionData.hasOwnProperty(key)) {
                items.push(productionData[key]);
            }
        }

        await cache.setItem(
          leverageVaultAddressesKey,
          items,
          {
            prefix: platformId,
            networkId: NetworkId.solana,
          }
        )
    }
}

const job: Job = {
    id: `${platformId}-leverage-addresses`,
    executor,
    label: 'normal',
}
export default job;
