import {
  NetworkId,
  NetworkIdType,
  formatTokenAddress,
  zeroAddressEvm,
} from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../../../utils/clients';
import { ethGaugeControllerAddress } from '../constants';
import { abi } from '../abi';
import { rangeBI } from '../../../utils/misc/rangeBI';
import { GaugesByPool } from '../types';

export async function getBalancerGaugesV2(
  gaugesUrl: string,
  networkId: NetworkIdType
): Promise<GaugesByPool> {
  if (networkId === NetworkId.ethereum) return getBalancerEthGaugesV2();
  return getBalancerChildGaugesV2(gaugesUrl);
}

async function getBalancerChildGaugesV2(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gaugesUrl: string
): Promise<GaugesByPool> {
  // TODO
  return {};
}

async function getBalancerEthGaugesV2() {
  const client = getEvmClient(NetworkId.ethereum);
  const nGauges = await client.readContract({
    address: ethGaugeControllerAddress,
    abi,
    functionName: 'n_gauges',
  });

  const gaugesRes = await client.multicall({
    contracts: rangeBI(nGauges).map((i) => ({
      abi,
      address: ethGaugeControllerAddress,
      functionName: 'gauges',
      args: [i],
    })),
  });

  const lpTokensRes = await client.multicall({
    contracts: gaugesRes.map((g) => ({
      abi,
      address: g.result || zeroAddressEvm,
      functionName: 'lp_token',
    })),
  });

  const gaugesByPool: GaugesByPool = {};
  lpTokensRes.forEach((lpTokenRes, i) => {
    if (lpTokenRes.status === 'failure') return;
    const gaugeRes = gaugesRes[i];
    if (gaugeRes.status === 'failure') return;

    const lpAddress = formatTokenAddress(lpTokenRes.result, NetworkId.ethereum);
    const gaugeAddress = formatTokenAddress(
      gaugeRes.result,
      NetworkId.ethereum
    );

    if (lpAddress === zeroAddressEvm) return;
    if (!gaugesByPool[lpAddress]) {
      gaugesByPool[lpAddress] = [];
    }
    gaugesByPool[lpAddress].push(gaugeAddress);
  });
  return gaugesByPool;
}
