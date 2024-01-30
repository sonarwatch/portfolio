import { NetworkId } from '@sonarwatch/portfolio-core';
import { USDC_MINT } from '@bonfida/spl-name-service';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { solanaLoanToken, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const usdcPrice = await cache.getTokenPrice(
    USDC_MINT.toString(),
    NetworkId.solana
  );

  if (!usdcPrice) return;
  await cache.setTokenPriceSource({
    address: solanaLoanToken,
    decimals: 6,
    id: platformId,
    networkId: NetworkId.solana,
    elementName: 'Loan',
    platformId,
    price: usdcPrice.price,
    timestamp: Date.now(),
    weight: 1,
    underlyings: [
      {
        address: usdcPrice.address,
        amountPerLp: 1,
        decimals: usdcPrice.decimals,
        networkId: NetworkId.solana,
        price: usdcPrice.price,
      },
    ],
  });
};

const job: Job = {
  id: `${platformId}-solana`,
  executor,
  label: 'normal',
};
export default job;
