import { getOwnerEthereum } from './ethereum';
import { getOwner } from './getOwner';

describe('name-service', () => {
  it('should works for ethereum', async () => {
    const owner = await getOwnerEthereum('vitalik.eth');
    expect(owner).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });

  it('should get owner', async () => {
    const owner = await getOwner('vitalik.eth');
    expect(owner.address).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });
});
