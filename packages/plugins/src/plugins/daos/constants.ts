import { PublicKey } from '@solana/web3.js';
import { VSRInfos } from './types';

export const platformId = 'realms';

export const heliumPlatformId = 'helium';
export const splGovProgramsKey = 'splGovernancePrograms';
export const registrarKey = 'registrars';

export const realmsCustomVsrInfo: VSRInfos[] = [
  {
    programId: new PublicKey('VoteMBhDCqGLRgYpp9o7DGyq81KNmwjXQRAHStjtJsS'), // Marinade
    mint: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
  },
  {
    programId: new PublicKey('4Q6WW2ouZ6V3iaNm56MTd5n2tnTm4C5fiH8miFHnAFHo'), // Mango
    mint: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
  },
  {
    programId: new PublicKey('VotEn9AWwTFtJPJSMV5F9jsMY6QwWM5qn3XP9PATGW7'), // PsyFi
    mint: 'PsyFiqqjiv41G7o5SMRzDJCu4psptThNR2GtfeGHfSq',
  },
  {
    programId: new PublicKey('5sWzuuYkeWLBdAv3ULrBfqA51zF7Y4rnVzereboNDCPn'), // Xandeum L1
    mint: '2j437Lt84XvysJiYbXTSJfAMy26Et9HiVGFvGFp8nYWH',
  },
];

export const realmsVsrProgram = new PublicKey(
  'vsr2nfGVNHmSY8uxoBGqq8AQbwz3JwaEaHqGbsTPXqQ'
);

export const splGovernanceUrl =
  'https://app.realms.today/api/splGovernancePrograms';

export const splGovernancePrograms: string[] = [
  'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
  'gUAedF544JeE6NYbQakQvribHykUNgaPJqcgf3UQVnY',
  'GqTPL6qRf5aUuqscLh8Rg2HTxPUXfhhAXDptTLhp1t2J',
  'DcG2PZTnj8s4Pnmp7xJswniCskckU5E6XsrKuyD7NYFK',
  '4ruGZqLoPVKX27Qm91Qjsqt5AzCtLrhmjKT8ubwHiVZu',
  'AEauWRrpn9Cs6GXujzdp1YhMmv2288kBt3SdEcPYEerr',
  'AVoAYTs36yB5izAaBkxRG67wL1AMwG3vo41hKtUSb8is',
  'G41fmJzd29v7Qmdi8ZyTBBYa98ghh3cwHBTexqCG1PQJ',
  'GovHgfDPyQ1GwazJTDY2avSVY8GGcpmCapmmCsymRaGe',
  'pytGY6tWRgGinSCvRLnSv4fHfBTMoiDGiCsesmHWM6U',
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
  'jtogvBNH3WBSWDYD5FJfQP2ZxNTuf82zL8GkEhPeaJx',
  'dgov7NC8iaumWw3k8TkmLDybvZBCmd1qwxgLAGAsWxf',
  'GovRp7uazvmYkQ7gqjdfjKFwr6pHDcYFWH3SP9DHzdtR',
];
