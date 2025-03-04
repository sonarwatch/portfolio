import { AddressSystem } from '../Address';
import { Network, NetworkId, NetworkIdType } from '../Network';
import {
  aptosNativeAddress,
  avalancheNativeAddress,
  avalancheNativeWrappedAddress,
  bitcoinNativeAddress,
  bnbNativeAddress,
  bnbNativeWrappedAddress,
  ethereumNativeAddress,
  ethereumNativeWrappedAddress,
  polygonNativeAddress,
  polygonNativeWrappedAddress,
  seiNativeAddress,
  solanaNativeAddress,
  solanaNativeDecimals,
  suiNativeAddress,
  suiNativeDecimals,
} from './addresses';

export const bitcoinNetwork: Network = {
  id: NetworkId.bitcoin,
  name: 'Bitcoin',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/bitcoin.webp',
  addressSystem: AddressSystem.bitcoin,
  chainId: 1,
  native: {
    address: bitcoinNativeAddress,
    decimals: 8,
    coingeckoId: 'bitcoin',
  },
  nativeWrapped: null,
  isLive: true,
  geckoId: 'bitcoin',
  llamaId: 'Bitcoin',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.bitcoin.tokenlist.json',
};
export const ethereumNetwork: Network = {
  id: NetworkId.ethereum,
  name: 'Ethereum',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/ethereum.webp',
  addressSystem: AddressSystem.evm,
  chainId: 1,
  native: {
    address: ethereumNativeAddress,
    decimals: 18,
    coingeckoId: 'ethereum',
  },
  nativeWrapped: {
    address: ethereumNativeWrappedAddress,
    decimals: 18,
    coingeckoId: 'weth',
  },
  isLive: true,
  geckoId: 'ethereum',
  llamaId: 'Ethereum',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.ethereum.tokenlist.json',
};
export const avalancheNetwork: Network = {
  id: NetworkId.avalanche,
  name: 'Avalanche',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/avalanche.webp',
  addressSystem: AddressSystem.evm,
  chainId: 43114,
  native: {
    address: avalancheNativeAddress,
    decimals: 18,
    coingeckoId: 'avalanche-2',
  },
  nativeWrapped: {
    address: avalancheNativeWrappedAddress,
    decimals: 18,
    coingeckoId: 'wrapped-avax',
  },
  isLive: true,
  geckoId: 'avalanche',
  llamaId: 'Avalanche',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.avalanche.tokenlist.json',
};
export const polygonNetwork: Network = {
  id: NetworkId.polygon,
  name: 'Polygon',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/polygon.webp',
  addressSystem: AddressSystem.evm,
  chainId: 137,
  native: {
    address: polygonNativeAddress,
    decimals: 18,
    coingeckoId: 'matic-network',
  },
  nativeWrapped: {
    address: polygonNativeWrappedAddress,
    decimals: 18,
    coingeckoId: 'wmatic',
  },
  isLive: true,
  geckoId: 'polygon-pos',
  llamaId: 'Polygon',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.polygon.tokenlist.json',
};
export const solanaNetwork: Network = {
  id: NetworkId.solana,
  name: 'Solana',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/solana.webp',
  addressSystem: AddressSystem.solana,
  chainId: 101,
  native: {
    address: solanaNativeAddress,
    decimals: solanaNativeDecimals,
    coingeckoId: 'solana',
  },
  nativeWrapped: null,
  isLive: true,
  geckoId: 'solana',
  llamaId: 'Solana',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.solana.tokenlist.json',
};
export const aptosNetwork: Network = {
  id: NetworkId.aptos,
  name: 'Aptos',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/aptos.webp',
  addressSystem: AddressSystem.move,
  chainId: 1,
  native: {
    address: aptosNativeAddress,
    decimals: 8,
    coingeckoId: 'aptos',
  },
  nativeWrapped: null,
  isLive: true,
  geckoId: 'aptos',
  llamaId: 'Aptos',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.aptos.tokenlist.json',
};
export const suiNetwork: Network = {
  id: NetworkId.sui,
  name: 'Sui',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/sui.webp',
  addressSystem: AddressSystem.move,
  chainId: 1,
  native: {
    address: suiNativeAddress,
    decimals: suiNativeDecimals,
    coingeckoId: 'sui',
  },
  nativeWrapped: null,
  isLive: true,
  geckoId: 'sui',
  llamaId: 'Sui',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.sui.tokenlist.json',
};

export const seiNetwork: Network = {
  id: NetworkId.sei,
  name: 'Sei',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/sei.webp',
  addressSystem: AddressSystem.sei,
  chainId: 1,
  native: {
    address: seiNativeAddress,
    decimals: 6,
    coingeckoId: 'sei',
  },
  nativeWrapped: null,
  isLive: true,
  geckoId: 'sei',
  llamaId: 'Sei',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.sei.tokenlist.json',
};

export const bnbNetwork: Network = {
  id: NetworkId.bnb,
  name: 'BNB Chain',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/networks/bnb.webp',
  addressSystem: AddressSystem.evm,
  chainId: 56,
  native: {
    address: bnbNativeAddress,
    decimals: 18,
    coingeckoId: 'binancecoin',
  },
  nativeWrapped: {
    address: bnbNativeWrappedAddress,
    decimals: 18,
    coingeckoId: 'wbnb',
  },
  isLive: true,
  geckoId: 'binance-smart-chain',
  llamaId: 'BSC',
  tokenListUrl:
    'https://github.com/sonarwatch/token-lists/releases/latest/download/sonarwatch.bnb.tokenlist.json',
};

export const networks: Record<NetworkIdType, Network> = {
  [NetworkId.aptos]: aptosNetwork,
  [NetworkId.avalanche]: avalancheNetwork,
  [NetworkId.polygon]: polygonNetwork,
  [NetworkId.bitcoin]: bitcoinNetwork,
  [NetworkId.bnb]: bnbNetwork,
  [NetworkId.ethereum]: ethereumNetwork,
  [NetworkId.solana]: solanaNetwork,
  [NetworkId.sui]: suiNetwork,
  [NetworkId.sei]: seiNetwork,
};

export const networksAsArray = Object.values(networks);

export const evmNetworks: Network[] = Object.values(networks).filter(
  (n) => n.addressSystem === AddressSystem.evm
);
