import { nameService as ensNameService } from './services/ens';
import { nameService as aptosNameService } from './services/aptos';
import { nameService as allNameService } from './services/allDomains';
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

  it('should getOwner for aptos', async () => {
    const owner = await aptosNameService.getOwner('geninsus.apt');
    expect(owner).toBe(
      '0xaa3fca2b46efb0c9b63e9c92ee31a28b9f22ca52a36967151416706f2ca138c6'
    );

    const owner2 = await aptosNameService.getOwner(
      'random-92ba7fb-9b35-46bc-ae5d-56b9c63672f3.apt'
    );
    expect(owner2).toBe(null);
  });

  it('should getNames for aptos', async () => {
    const names = await aptosNameService.getNames(
      '0xaa3fca2b46efb0c9b63e9c92ee31a28b9f22ca52a36967151416706f2ca138c6'
    );
    expect(names.some((name) => name === 'geninsus.apt')).toBe(true);

    const names2 = await aptosNameService.getNames(
      '0xrand0mfca2b46efb0c9b63e9c92ee31a28b9f22ca52a36967151416706f2ca138c6'
    );
    expect(names2.length).toBe(0);
  });

  it('should getOwner for allDomains', async () => {
    const owner = await allNameService.getOwner('miester.all');
    expect(owner).toBe(
      '2EGGxj2qbNAJNgLCPKca8sxZYetyTjnoRspTPjzN2D67'
    );

    const owner2 = await allNameService.getOwner(
      'miaster.all'
    );
    expect(owner2).toBe(null);
  });

  it('should getNames for allDomains', async () => {
    const names = await allNameService.getNames(
      '2EGGxj2qbNAJNgLCPKca8sxZYetyTjnoRspTPjzN2D67'
    );
    expect(names.some((name) => name === 'miester.abc')).toBe(true);

    const names2 = await aptosNameService.getNames(
      '11111111111111111111111111111111'
    );
    expect(names2.length).toBe(0);
  });
});
