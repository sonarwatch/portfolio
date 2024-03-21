import {
  NetworkId,
  NetworkIdType,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { getCosmWasmClient } from '@sei-js/core';
import {
  getClientAptos,
  getClientSei,
  getClientSolana,
  getClientSui,
} from '../clients';
import { getUrlEndpoint } from '../clients/constants';
import { TokenInfo, tokenInfoQueryMsg } from '../sei';
import { Cache } from '../../Cache';
import { tokenListsDetailsPrefix } from '../../plugins/tokens/constants';
import { Token } from '../../plugins/tokens/types';
import { getDecimals as getDecimalsAptos } from '../aptos/getDecimals';
import { getDecimals as getDecimalsSolana } from '../solana/getDecimals';
import { getDecimals as getDecimalsSui } from '../sui/getDecimals';

/**
 * Return the decimals of a token on any network using RPC calls or TokenList.
 *
 * @param cache Cache where to look for decimals
 * @param address The mint/address of the token.
 * @param networkId The network on which to execute the request.
 *
 * @returns The number of decimals or undefined if unsucessful request.
 */
export async function getDecimalsForToken(
  cache: Cache,
  address: string,
  networkId: NetworkIdType
): Promise<number | null> {
  const tokenDetails = await cache.getItem<Token>(
    formatTokenAddress(address, networkId),
    {
      prefix: tokenListsDetailsPrefix,
      networkId,
    }
  );
  if (tokenDetails) return tokenDetails.decimals;

  switch (networkId) {
    case 'aptos': {
      const client = getClientAptos();
      return getDecimalsAptos(client, address);
    }
    case 'solana': {
      const client = getClientSolana();
      return getDecimalsSolana(client, new PublicKey(address));
    }
    case 'sei': {
      if (address.startsWith('factory')) {
        const client = await getClientSei();
        const rep = await client.cosmos.bank.v1beta1.denomMetadata({
          denom: address,
        });
        const denoms = rep.metadata.denomUnits;
        return denoms[denoms.length - 1].exponent;
      }
      if (address.startsWith('ibc')) {
        // No solution yet for IBC tokens
        return null;
      }
      if (address.startsWith('sei')) {
        const client = await getCosmWasmClient(getUrlEndpoint(NetworkId.sei));
        const tokenInfo = (await client.queryContractSmart(
          address,
          tokenInfoQueryMsg
        )) as TokenInfo;
        return tokenInfo.decimals || null;
      }
      return null;
    }
    case 'sui': {
      const client = getClientSui();
      return getDecimalsSui(client, address);
    }
    default:
      throw new Error('getDecimalsForToken : Network not supported');
  }
}
