import { ethereumNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const ethFactor = new BigNumber(10 ** ethereumNetwork.native.decimals);
