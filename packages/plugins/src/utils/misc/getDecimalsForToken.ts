import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { getCosmWasmClient } from '@sei-js/core';
import { getClientAptos, getClientSolana } from '../clients';
import { coinDecimals } from '../aptos';
import { getUrlEndpoint } from '../clients/constants';
import { TokenInfo } from '../../plugins/seaswap/types';
import { tokenInfoQueryMsg } from '../sei';

/**
 * Return the decimals of a token on any network using RPC calls.
 *
 * @param address The mint/address of the token.
 * @param networkId The network on which to execute the request.
 *
 * @returns The number of decimals or undefined if unsucessful request.
 */
export async function getDecimalsForToken(
  address: string,
  networkId: NetworkIdType
): Promise<number | undefined> {
  switch (networkId) {
    case 'aptos': {
      const client = getClientAptos();
      const viewRes = (await client.view({
        function: coinDecimals,
        type_arguments: [address],
        arguments: [],
      })) as number[];
      if (viewRes.length !== 1) return undefined;
      return viewRes[0];
    }
    case 'solana': {
      const client = getClientSolana();
      const res = await client.getTokenSupply(new PublicKey(address));
      return res.value.decimals ? res.value.decimals : undefined;
    }
    case 'sei': {
      if (!address.startsWith('sei')) return undefined;
      const cosmWasmClient = await getCosmWasmClient(
        getUrlEndpoint(NetworkId.sei)
      );
      const tokenInfo = (await cosmWasmClient.queryContractSmart(
        address,
        JSON.parse(tokenInfoQueryMsg)
      )) as TokenInfo;
      return tokenInfo.decimals || undefined;
    }
    default:
      throw new Error('getDecimalsForToken : Network not supported');
  }
}
