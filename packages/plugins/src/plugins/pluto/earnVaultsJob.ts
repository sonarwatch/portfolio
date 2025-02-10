import { NetworkId } from "@sonarwatch/portfolio-core";
import { Cache } from "../../Cache";
import { Job, JobExecutor } from "../../Job";
import { platformId, plutoProgramId } from "./constants";
import { getClientSolana } from "../../utils/clients";
import { calculateLenderPDA, getAllEarn, getAllEarnLender, testing } from "./helper";
import { PublicKey } from "@solana/web3.js";

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const userAddress = 'Cc3ALXeuWVPQyaEQvVWyW3j8saTZbDgc3PkuAZhHsrg4'
  
  const lender = await getAllEarnLender(client)
  console.log(lender);
  return;
  const earnVault = await getAllEarn(client)
  earnVault.forEach((async (earnVal) => {
    let lenderAddress: PublicKey;
    [lenderAddress] = await calculateLenderPDA(plutoProgramId, earnVal.pubkey, earnVal.tokenMint, new PublicKey(userAddress));
    
    const earnLenderAddress = lenderAddress.toString();
    const earnLender = lender.filter((earnLender) => earnLender.owner.equals(new PublicKey(userAddress)))
    console.log(earnLender)
  }))
};

const job: Job = {
    id: `${platformId}-earn-vault`,
    executor,
    label: 'normal',
}
export default job;
