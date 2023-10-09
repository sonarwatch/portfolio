import { nameService as ensNameService } from './services/ens';
import { getOwner } from './getOwner';

describe('name-service', () => {
  it('should getOwner', async () => {
    const owner = await getOwner('vitalik.eth');
    expect(owner?.address).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });

  it('should getOwner for ethereum', async () => {
    const owner = await ensNameService.getOwner('vitalik.eth');
    expect(owner).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });

  it('should getNames for ethereum', async () => {
    const names = await ensNameService.getNames(
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    );
    expect(names.some((name) => name === 'vitalik.eth')).toBe(true);
  });
});
