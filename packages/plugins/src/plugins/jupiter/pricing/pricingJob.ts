import {
  NetworkId,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { platformId } from '../exchange/constants';
import {
  jupDatapiHeaderKey,
  jupDatapiHeaderValue,
  jupDatapiTokensUrl,
} from '../constants';
import { lfntyMint, xLfntyMint } from '../../lifinity/constants';
import { setJupiterPrices } from './setJupiterPrices';

const mints = [
  solanaNativeWrappedAddress,
  '8Yv9Jz4z7BUHP68dz8E8m3tMe6NKgpMUKn8KVqrPA6Fr', // Wrapped USDC (Allbridge from Avalanche)
  'FHfba3ov5P3RjaiLVgh8FTv4oirxQDoVXuoUUDvHuXax', // USDC (Wormhole from Avalanche)
  'Kz1csQA91WUGcQ2TB3o5kdGmWmMGp8eJcDEyHzNDVCX', // USDT (Wormhole from Avalanche)
  'Bn113WT6rbdgwrm12UJtnmNqGqZjY4it2WoUQuQopFVn', // Wrapped USDT (Allbridge from Ethereum)
  'E77cpQ4VncGmcAXX16LHFFzNBEBb2U7Ar7LBmZNfCgwL', // Wrapped USDT (Allbridge from BSC)
  '8qJSyQprMC57TWKaYEmetUR3UUiTP2M3hXdcvFhkZdmv', // Tether USD (Wormhole from BSC)
  xLfntyMint,
  lfntyMint,
];

const executor: JobExecutor = async (cache: Cache) => {
  if (!jupDatapiHeaderKey || !jupDatapiHeaderValue) {
    return;
  }

  if (!jupDatapiTokensUrl)
    throw new Error('PORTFOLIO_JUP_DATAPI_TOKENS_URL not set');

  const apiRes = await axios.get<{ addresses: string[] }>(jupDatapiTokensUrl, {
    headers: {
      [jupDatapiHeaderKey]: jupDatapiHeaderValue,
    },
  });

  const tokens = apiRes.data.addresses;
  mints.forEach((m) => tokens.push(m));

  await setJupiterPrices(tokens, cache);
};
const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  labels: [NetworkId.solana, 'manual'],
};
export default job;
