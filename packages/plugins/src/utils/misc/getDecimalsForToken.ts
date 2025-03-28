import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
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
import { getDecimals as getDecimalsAptos } from '../aptos/getDecimals';
import { getDecimals as getDecimalsSolana } from '../solana/getDecimals';
import { getDecimals as getDecimalsSui } from '../sui/getDecimals';

type Decimal = number | null;

export async function getDecimalsForToken(
  address: string,
  networkId: NetworkIdType
): Promise<Decimal> {
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
