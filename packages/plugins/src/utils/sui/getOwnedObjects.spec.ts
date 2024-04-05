import { getClientSui } from '../clients';
import { getOwnedObjects } from './getOwnedObjects';

describe('getOwnedObjects', () => {
  it('should getOwnedObjects', async () => {
    const client = getClientSui();
    const objects = await getOwnedObjects(
      client,
      '0x0123456789012345678901234567890123456789012345678901234567891234',
      {
        options: {
          showType: true,
        },
      }
    );
    expect(objects.length).toEqual(0);
  });
});
