import {
  NetworkId,
  TokenPriceSource,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './exchange/constants';
import { getJupiterPrices } from './helpers';
import { walletTokensPlatform } from '../tokens/constants';
import { getMultipleDecimalsAsMap } from '../../utils/solana/getMultipleDecimalsAsMap';
import { getClientSolana } from '../../utils/clients';
import { lstsKey, platformId as sanctumPlatformId } from '../sanctum/constants';

const mints = [
  'xLfNTYy76B8Tiix3hA51Jyvc1kMSFV4sPdR7szTZsRu', // xLifinity
  'BANXbTpN8U2cU41FjPxe2Ti37PiT5cCxLUKDQZuJeMMR', // Banx
  '4LLbsb5ReP3yEtYzmXewyGjcir5uXtKFURtaEUVC2AHs', // Parcl
  'SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s', // Shark
  'KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS', // Kamino
  'DdFPRnccQqLD4zCHrBqdY95D6hvw6PLWp9DEXj1fLCL9', // Wrapped USDC (Allbridge from Ethereum)
  'eqKJTf1Do4MDPyKisMYqVaUFpkEFAs3riGF3ceDH2Ca', // Wrapped USDC (Allbridge from Polygon)
  '8Yv9Jz4z7BUHP68dz8E8m3tMe6NKgpMUKn8KVqrPA6Fr', // Wrapped USDC (Allbridge from Avalanche)
  'FHfba3ov5P3RjaiLVgh8FTv4oirxQDoVXuoUUDvHuXax', // USDC (Wormhole from Avalanche)
  'Kz1csQA91WUGcQ2TB3o5kdGmWmMGp8eJcDEyHzNDVCX', // USDT (Wormhole from Avalanche)
  '9EaLkQrbjmbbuZG9Wdpo8qfNUEjHATJFSycEmw6f1rGX', // pSOL (Parrot SOL)
  '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', // stSOL
  'Bn113WT6rbdgwrm12UJtnmNqGqZjY4it2WoUQuQopFVn', // Wrapped USDT (Allbridge from Ethereum)
  'FwEHs3kJEdMa2qZHv7SgzCiFXUQPEycEXksfBkwmS8gj', // Wrapped USDT (Allbridge from Avalanche)
  '8XSsNvaKU9FDhYWAv7Yc7qSNwuJSzVrXBNEk7AFiWF69', // Wrapped USDC (Allbridge from BSC)
  'E77cpQ4VncGmcAXX16LHFFzNBEBb2U7Ar7LBmZNfCgwL', // Wrapped USDT (Allbridge from BSC)
  'EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o', // DAI (Portal from Ethereum)
  '5RpUwQ8wtdPCZHhu6MERp2RGrpobsbZ6MH5dDHkUjs2', // BUSD Token (Wormhole from BSC)
  'FCqfQSujuPxy6V42UvafBhsysWtEq1vhjfMN1PUbgaxA', // USD Coin (Wormhole from BSC)
  '8qJSyQprMC57TWKaYEmetUR3UUiTP2M3hXdcvFhkZdmv', // Tether USD (Wormhole from BSC)
  'UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG', // UPT
];
const vsToken = solanaNativeWrappedAddress;

const executor: JobExecutor = async (cache: Cache) => {
  const sanctumMints = await cache.getItem<string[]>(lstsKey, {
    prefix: sanctumPlatformId,
    networkId: NetworkId.solana,
  });
  const connection = getClientSolana();
  const solTokenPrice = await cache.getTokenPrice(vsToken, NetworkId.solana);
  if (!solTokenPrice) return;

  const mintsPk = mints.map((m) => new PublicKey(m));
  if (sanctumMints) mintsPk.push(...sanctumMints.map((m) => new PublicKey(m)));
  const prices = await getJupiterPrices(mintsPk, new PublicKey(vsToken));
  const decimalsMap = await getMultipleDecimalsAsMap(connection, mintsPk);
  const sources: TokenPriceSource[] = [];
  prices.forEach((price, mint) => {
    const decimals = decimalsMap.get(mint);
    if (!decimals) return;
    const source: TokenPriceSource = {
      address: mint,
      decimals,
      id: 'jupiter-api',
      networkId: NetworkId.solana,
      timestamp: Date.now(),
      price: solTokenPrice.price * price,
      platformId: walletTokensPlatform.id,
      weight: 0.1,
    };
    sources.push(source);
  });
  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  label: 'coingecko',
};
export default job;
