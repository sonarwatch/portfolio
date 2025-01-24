import { Job, JobExecutor } from "../../Job";
import { leverageVaultKey, platformId } from "./constants";
import { Cache } from '../../Cache';
import { getLeverageVaults } from "./helper";
import { NetworkId } from "@sonarwatch/portfolio-core";

const executor: JobExecutor = async (cache: Cache) => {
    const leverageVault = await getLeverageVaults();
    const storedLeverageVault: {
        key: string;
        value: any;
      }[] = [];

    if (leverageVault?.production) {
        const productionData = leverageVault.production;
        for (const key in productionData) {
            if (productionData.hasOwnProperty(key)) {
                const item = productionData[key];
                if (item.leverageName) { 
                    storedLeverageVault.push({
                        key: item.leverageName,
                        value: item,
                    })
                    storedLeverageVault.push({
                        key: item.earnName,
                        value: item,
                    })
                }
            }
        }

        await cache.setItems(storedLeverageVault, {
            prefix: leverageVaultKey,
            networkId: NetworkId.solana,
        })
    }
}

const job: Job = {
    id: `${platformId}-leverage-vault`,
    executor,
    label: 'normal',
}
export default job;