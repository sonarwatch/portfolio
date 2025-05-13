import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

// lookupAddressTable Es56bH1dokFwohpWS8XYSfTXavvSEuyob2FnUYzF6pCL
const programIds = [
  'RAtEwzA1rerjeWip6uMuheQtzykxYCrEQRaSFCCrf2D',
  'RATEuvat8kBBvomUgsbGDS2EV4KjKCoMKCP3DpxYmF8',
  'RAtEjoYMC6U3fWrbxcuda1N4hcgDbgqQN8MFCsA7ge2',
  'rAtEti4KRfAtVTYhcdYbVznJkbt8yTAXebwHEAr31xr',
  'RAtegmyRsp72GuTVFrg68KC4EryqHYp5tWNdm9qJ3ub',
  'rATeLFtHiGs6Q1rz4VNsp62vc3B8dLsDrNFm2NzKHSR',
  'rAtERVnFCEdaY3BqP7w1wdMJFphHz9m8uTyLjRkw8Fu',
  'ratEH6tibNBomaJtiFtivmPk7pxcPPvRg3mEt8vZiEK',
  'rATEA6NzH5jVXbJkAwPsknuvviVrSnSpARNATkG2ZJ6',
  'raTeSRo3LFRvsrcXFKgu1P8F4DLE39h6b1zeT2HfwAq',
  'RaTEiNdQ31benKiF11k1kzv48EeK69HHNadvQXiFq6Z',
  'raTeSq8Ebeb1JR3xRgSz7i2DP35Fyz5zsszkijgnXKm',
  'RaTeUhvvohYGErSb2Sy3RA5EdMv9A9jtiJe8FHTg7uK',
  'rAtewzmMSgn1QGewCM8PHdoW49bbuzrDQi4ftFoTFWo',
  'ratEoDQr8juEipHZ7kx1Vu7BffJ2t2R27ScJCJHDiSV',
  'RAtELWRTmTxPtDUue6ihnoXRhLzjbFixvJmH9RwymLo',
];

export const services: ServiceDefinition[] = programIds.map((programId, i) => ({
  id: `ratex-${i}`,
  name: 'RateX',
  platformId: 'ratex',
  networkId: NetworkId.solana,
  contracts: [
    {
      name: 'RateX',
      address: programId,
      platformId: 'ratex',
    },
  ],
}));
export default services;
