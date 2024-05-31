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
  // Sanctum / LSTs
  'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX',
  'pWrSoLAhue6jUxUkbWgmEy5rD9VJzkFmvfTDV5KgNuu',
  'st8QujHLPsX3d6HG9uQg9kJ91jFxUgruwsb1hyYXSNd',
  'strng7mqqc1MBJJV6vMzYbEqnwVGvKKGKedeCvtktWA',
  'suPer8CPwxoJPQ7zksGMwFvjBQhjAHwUMmPV4FVatBw',
  'vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7',
  'Zippybh3S5xYYam2nvL6hVJKz1got6ShgV4DyD1XQYF',
  'CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE',
  'GRJQtWwdJmp5LLpy8JWjPgn5FnLyqSJGNhn5ZnCTFUwM',
  'edge86g9cVz87xcpKpy3J77vbp4wYd9idEV562CCntt',
  'he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A',
  'pathdXw4He1Xk3eX84pDdDZnGKEme3GivBamGCVPZ5a',
  '7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn',
  'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v',
  'LnTRntk2kTfWEY6cVB8K9649pgJbt6dJLS1Ns1GZCWg',
  'phaseZSfPxTDBpiVb96H4XFSD8xHeHxZre5HerehBJG',
  'picobAEvs6w7QEknPce34wAE4gknZA9v5tTonnmHYdX',
  'pumpkinsEq8xENVZE6QgTS93EN4r9iKvNxNALS1ooyp',
];
const vsToken = solanaNativeWrappedAddress;

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const solTokenPrice = await cache.getTokenPrice(vsToken, NetworkId.solana);
  if (!solTokenPrice) return;

  const mintsPk = mints.map((m) => new PublicKey(m));
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
