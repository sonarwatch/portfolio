import { getOwnerAptos } from './aptos';
import { getOwnerEthereum } from './ethereum';
import { getOwner } from './getOwner';

describe('name-service', () => {
  it('should works for ethereum', async () => {
    const owner = await getOwnerEthereum('vitalik.eth');
    expect(owner).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });

  it('should works for aptos', async () => {
    const owner = await getOwnerAptos('geninsus.apt');
    expect(owner).toBe(
      '0xaa3fca2b46efb0c9b63e9c92ee31a28b9f22ca52a36967151416706f2ca138c6'
    );
  });

  it('should get owner with .eth', async () => {
    const owner = await getOwner('vitalik.eth');
    expect(owner.address).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });

  it('should get owner with .apt', async () => {
    const owner = await getOwner('geninsus.apt');
    expect(owner.address).toBe(
      '0xaa3fca2b46efb0c9b63e9c92ee31a28b9f22ca52a36967151416706f2ca138c6'
    );
  });
});
