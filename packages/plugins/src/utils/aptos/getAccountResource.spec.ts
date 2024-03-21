import { getAccountResource } from './getAccountResource';
import { getClientAptos } from '../clients';
import { getAccountResources } from './getAccountResources';

describe('getAccountResource', () => {
  it('should getAccountResource', async () => {
    const client = getClientAptos();
    const aResource = await getAccountResource(
      client,
      '0x0123456789012345678901234567890123456789012345678901234567890123',
      '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    );
    expect(aResource).toEqual(null);

    const bResource = await getAccountResource(
      client,
      '0x83699e64ad139e3be9996da314dc5679229e320e292476f33ce00c6681650b8e',
      '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    );
    expect(aResource).toEqual(null);
    expect(bResource).not.toEqual(null);
  });

  it('should getAccountResources', async () => {
    const client = getClientAptos();
    const aResources = await getAccountResources(
      client,
      '0x0123456789012345678901234567890123456789012345678901234567890123'
    );
    expect(aResources).toEqual(null);

    const bResources = await getAccountResources(
      client,
      '0x83699e64ad139e3be9996da314dc5679229e320e292476f33ce00c6681650b8e'
    );
    expect(aResources).toEqual(null);
    expect(bResources).not.toEqual(null);
  });
});
