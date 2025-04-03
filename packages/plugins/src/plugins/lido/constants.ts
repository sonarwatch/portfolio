import { NetworkId } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';

export const platformId = 'lido';
export const networkId = NetworkId.ethereum;

export const withdrawlQueueAddress: Address =
  '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1';

export const stETHAddress: Address =
  '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
export const wstETHAddress: Address =
  '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0';
export const stMATICAddress: Address =
  '0x9ee91F9f426fA633d227f7A9b000E28b9dFD8599';

export const stakedAddresses = [stETHAddress, wstETHAddress, stMATICAddress];

export const nftAddress: Address = '0x4D72BFf1BeAC69925f8BD12526a39BaAB069E5dA';

export const lidoCSMOperatorsKey = 'lido-csm-operators';

export const nftCSMAddress: Address =
  '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F';

export const maticTokenAddress: Address =
  '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
