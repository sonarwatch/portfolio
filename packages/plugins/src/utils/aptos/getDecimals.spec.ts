import { getClientAptos } from '../clients';
import { getDecimals } from './getDecimals';

describe('getDecimals', () => {
  it('should getDecimals', async () => {
    const client = getClientAptos();
    const decimals = await getDecimals(
      client,
      '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC'
    );
    expect(decimals).toEqual(6);
  });
});
