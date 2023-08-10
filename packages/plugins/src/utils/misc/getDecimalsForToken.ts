import { NetworkIdType } from '@sonarwatch/portfolio-core';
import { getClientAptos } from '../clients';
import { coinDecimals } from '../aptos';

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
    default:
      throw new Error('getDecimalsForToken : Network not supported');
  }
}
