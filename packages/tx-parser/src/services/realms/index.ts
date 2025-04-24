import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'realms';

const vsrPrograms = [
  'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
  'gUAedF544JeE6NYbQakQvribHykUNgaPJqcgf3UQVnY',
  'GqTPL6qRf5aUuqscLh8Rg2HTxPUXfhhAXDptTLhp1t2J',
  'DcG2PZTnj8s4Pnmp7xJswniCskckU5E6XsrKuyD7NYFK',
  '4ruGZqLoPVKX27Qm91Qjsqt5AzCtLrhmjKT8ubwHiVZu',
  'AEauWRrpn9Cs6GXujzdp1YhMmv2288kBt3SdEcPYEerr',
  'AVoAYTs36yB5izAaBkxRG67wL1AMwG3vo41hKtUSb8is',
  'G41fmJzd29v7Qmdi8ZyTBBYa98ghh3cwHBTexqCG1PQJ',
  'GovHgfDPyQ1GwazJTDY2avSVY8GGcpmCapmmCsymRaGe',
  // 'pytGY6tWRgGinSCvRLnSv4fHfBTMoiDGiCsesmHWM6U', // Made a dedicated service for this
  'J9uWvULFL47gtCPvgR3oN7W357iehn5WF2Vn9MJvcSxz',
  'JPGov2SBA6f7XSJF5R4Si5jEJekGiyrwP2m7gSEqLUs',
  '5hAykmD4YGcQ7Am3N7nC9kyELq6CThAkU82nhNKDJiCy',
  'gSF1T5PdLc2EutzwAyeExvdW27ySDtFp88ri5Aymah6',
  'GmtpXy362L8cZfkRmTZMYunWVe8TyRjX5B7sodPZ63LJ',
  'GMpXgTSJt2nJ7zjD1RwbT2QyPhKqD2MjAZuEaLsfPYLF',
  'bqTjmeob6XTdfh12px2fZq4aJMpfSY1R1nHZ44VgVZD',
  'Ghope52FuF6HU3AAhJuAAyS2fiqbVhkAotb7YprL5tdS',
  '5sGZEdn32y8nHax7TxEyoHuPS3UXfPWtisgm8kqxat8H',
  'smfjietFKFJ4Sbw1cqESBTpPhF4CwbMwN8kBEC1e5ui',
  'GovMaiHfpVPw8BAM1mbdzgmSZYDw2tdP32J2fapoQoYs',
  'GCockTxUjxuMdojHiABVZ5NKp6At8eTKDiizbPjiCo4m',
  'HT19EcD68zn7NoCF79b2ucQF8XaMdowyPt5ccS6g1PUx',
  'GRNPT8MPw3LYY6RdjsgKeFji5kMiG1fSxnxDjDBu4s73',
  'ALLGnZikNaJQeN4KCAbDjZRSzvSefUdeTpk18yfizZvT',
  'A7kmu2kUcnQwAVn8B4znQmGJeUrsJ1WEhYVMtmiBLkEr',
  'MGovW65tDhMMcpEmsegpsdgvzb6zUwGsNjhXFxRAnjd',
  'jdaoDN37BrVRvxuXSeyR7xE5Z9CAoQApexGrQJbnj6V',
  'GMnke6kxYvqoAXgbFGnu84QzvNHoqqTnijWSXYYTFQbB',
  'Di9ZVJeJrRZdQEWzAFYmfjukjR5dUQb7KMaDmv34rNJg',
  'hgovkRU6Ghe1Qoyb54HdSLdqN7VtxaifBzRmh9jtd3S',
  // 'jtogvBNH3WBSWDYD5FJfQP2ZxNTuf82zL8GkEhPeaJx', // Made a dedicated service for this
  'dgov7NC8iaumWw3k8TkmLDybvZBCmd1qwxgLAGAsWxf',
  'GovRp7uazvmYkQ7gqjdfjKFwr6pHDcYFWH3SP9DHzdtR',
  'VoteMBhDCqGLRgYpp9o7DGyq81KNmwjXQRAHStjtJsS',
  '4Q6WW2ouZ6V3iaNm56MTd5n2tnTm4C5fiH8miFHnAFHo',
  'VotEn9AWwTFtJPJSMV5F9jsMY6QwWM5qn3XP9PATGW7',
  '5sWzuuYkeWLBdAv3ULrBfqA51zF7Y4rnVzereboNDCPn',
];

const contract = {
  name: 'VSR',
  address: 'vsr2nfGVNHmSY8uxoBGqq8AQbwz3JwaEaHqGbsTPXqQ',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-governance`,
  name: 'DAO',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [
  service,
  ...vsrPrograms.map((address) => ({
    id: `${platformId}-vsr-${address}`,
    name: 'DAO',
    platformId,
    networkId: NetworkId.solana,
    contracts: [
      {
        name: 'VSR',
        address,
        platformId,
      },
    ],
  })),
];
export default services;
