import BigNumber from 'bignumber.js';
import { BN } from 'bn.js';

export const PRICE_PRECISION_EXP = new BN(6);
export const PRICE_PRECISION = new BN(10).pow(PRICE_PRECISION_EXP);
export const PRICE_PRECISION_BIG_NUMBER = new BigNumber(
  PRICE_PRECISION.toString()
);
export const PEG_PRECISION_EXP = new BN(6);
export const PEG_PRECISION = new BN(10).pow(PEG_PRECISION_EXP);
export const ZERO = new BN(0);
export const ONE = new BN(1);
export const TWO = new BN(2);
export const TEN = new BN(10);
export const AMM_RESERVE_PRECISION_EXP = new BN(9);
export const QUOTE_PRECISION_EXP = new BN(6);
export const QUOTE_PRECISION = new BN(10).pow(QUOTE_PRECISION_EXP);
export const AMM_RESERVE_PRECISION = new BN(10).pow(AMM_RESERVE_PRECISION_EXP);
export const AMM_TO_QUOTE_PRECISION_RATIO =
  AMM_RESERVE_PRECISION.div(QUOTE_PRECISION);
export const PRICE_DIV_PEG = PRICE_PRECISION.div(PEG_PRECISION);
export const BID_ASK_SPREAD_PRECISION = new BN(1000000);
export const PERCENTAGE_PRECISION_EXP = new BN(6);
export const PERCENTAGE_PRECISION = new BN(10).pow(PERCENTAGE_PRECISION_EXP);
export const DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT = new BN(
  -25
).mul(QUOTE_PRECISION);
export const AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO =
  AMM_RESERVE_PRECISION.mul(PEG_PRECISION).div(QUOTE_PRECISION);
export const FIVE_MINUTE = new BN(60 * 5);
export const FUNDING_RATE_BUFFER_PRECISION_EXP = new BN(3);
export const FUNDING_RATE_BUFFER_PRECISION = new BN(10).pow(
  FUNDING_RATE_BUFFER_PRECISION_EXP
);
export const SPOT_MARKET_IMF_PRECISION_EXP = new BN(6);
export const SPOT_MARKET_IMF_PRECISION = new BN(10).pow(
  SPOT_MARKET_IMF_PRECISION_EXP
);
export const SPOT_MARKET_WEIGHT_PRECISION = new BN(10000);

export const oracleToMintLocal = [
  [
    '4o4CUwzFwLqCvmA5x1G4VzoZkAhAcbiuiYyjWX1CVbY2',
    '4cwVHQtwiK7r9aAUsu4cetk1JtLWPymopWcpTSsihCdL',
  ],
  [
    'g6eRCbboSwK4tSWngn773RCMexr1APQr4uA9bGZBYfo',
    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  ],
  [
    '4CkQJBxhU8EZ2UjhigbtdaPbpTe6mqf811fipYBFbSYN',
    '9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa',
  ],
  [
    'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB',
    '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
  ],
  [
    'FNNvb1AFDnDVPkocEri8mWbJ1952HQZtFLuwPiUjSJQ',
    'HHncifGW3yJyaW2fRRfBYAawnD9ogbsWM5PccFA4GHSx',
  ],
  [
    'D8UUgr8a3aR3yUeHLu7v8FWK7E8Y5sSU7qrYBXUJXBQ5',
    'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL',
  ],
  [
    '7KVswB9vkCgeM3SHP7aGDijvdRAHK8P5wi9JXViCrtYh',
    'Gz7VkD4MacbEB6yC5XD3HcumEiYx2EtDYYrfikGsvopG',
  ],
  [
    'ALdkqQDMfHNg77oCNskfX751kHys4KE7SFuZzuKaN536',
    '2wpTofQ8SkACrkZWrZDjXPitYa8AwWgX8AfxdeBRRVLX',
  ],
  [
    'H9j8CT1bFiWHaZUPMooEaxMRHdWdJ5T9CzFn41z96JHW',
    '85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ',
  ],
  [
    'PeNpQeGEm9UEFJ6MBCMauY4WW4h3YxoESPWbsqVKucE',
    'DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7',
  ],
  [
    '7Cfyymx49ipGsgEsCA2XygAB2DUsan4C6Cyb5c8oR5st',
    'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6',
  ],
  [
    'Gcm39uDrFyRCZko4hdrKMTBQsboPJHEd4RwnWhWFKr9a',
    'BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K',
  ],
  [
    '7moA1i5vQUpfDwSpK6Pw9s56ahB7WFGidtbL2ujWrVvm',
    'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux',
  ],
  [
    'nrYkQQQur7z8rYTST3G9GqATviK5SxTDkrqd21MW6Ue',
    'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
  ],
  [
    '8ihFLu5FimgTQ1Unh4dVyEHUGodJ5gJQCrQf4KUVB9bN',
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  ],
  [
    'GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU',
    '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',
  ],
  [
    'Ax9ujW5B9oqcv59N8m6f1BpTBq2rGeGaBcpKjC5UYsXU',
    'KgV1GvrHQmRBY8sHQQeUKwTm2r2h8t4C8qt12Cw1HVE',
  ],
  [
    '3Qub3HaAJaa2xNY7SUqPKd3vVwTqDfDDkEUMPjXD2c1q',
    'JzwfZvJGdsqbrKZQUvzJpWhbHcZUix7CYcCaoiNpjxg',
  ],
  [
    '6ABgrEZk8urs6kJ1JNdC1sspH5zKXRqxy8sg3ZG2cQps',
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  ],
  [
    'CYGfrBJB9HgLf9iZyN4aH5HvUAi2htQ4MjPxeXMf4Egn',
    'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof',
  ],
  [
    '5HRrdmghsnU3i2u5StaKaydS7eq3vnKVKwXMzCNKsc4C',
    '9cMWa1wuWcio3vgEpiFg7PqKbcoafuUw5sLYFkXJ2J8M',
  ],
  [
    'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG',
    'So11111111111111111111111111111111111111112',
  ],
  [
    '6ynsvjkE2UoiRScbDx7ZxbBsyn7wyvg5P1vENvhtkG1C',
    'KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS',
  ],
];
