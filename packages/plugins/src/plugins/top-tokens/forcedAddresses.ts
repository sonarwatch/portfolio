import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';

const forcedAddresses: Map<NetworkIdType, string[]> = new Map([
  [
    NetworkId.ethereum,
    [
      '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      '0xae78736Cd615f374D3085123A210448E74Fc6393',
      '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
      '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
      '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
    ],
  ],
  [
    NetworkId.polygon,
    [
      '0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD',
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ],
  ],
  [NetworkId.avalanche, ['0x152b9d0FdC40C096757F570A51E494bd4b943E50']],
]);
export default forcedAddresses;
