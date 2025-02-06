import { NetworkId } from "@sonarwatch/portfolio-core";
import { Cache } from "../../Cache";
import { Job, JobExecutor } from "../../Job";
import { platformId } from "./constants";
import { getClientSolana } from "../../utils/clients";
import { getAllEarn } from "./helper";

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  
  await getAllEarn(
    client
  )
};

const job: Job = {
    id: `${platformId}-earn-vault`,
    executor,
    label: 'normal',
}
export default job;
