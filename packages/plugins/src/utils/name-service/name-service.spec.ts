import { solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { nameService as ensNameService } from './services/ens';
import { nameService as aptosNameService } from './services/aptos';
import { nameService as bonfidaNameService } from './services/bonfida';
import { nameService as suiNameService } from './services/sui';
import { nameService as allDomainsNameService } from './services/allDomains';
import { getOwner } from './getOwner';

describe('name-service', () => {
  it('should getOwner with eth address', async () => {
    const owner = await getOwner('vitalik.eth');
    expect(owner?.address).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  });

  it('should getOwner with solana address', async () => {
    const owner = await getOwner('defichecker.sol');
    expect(owner?.address).toBe('tEsT1vjsJeKHw9GH5HpnQszn2LWmjR6q1AVCDCj51nd');
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

  it('should getOwner for sui', async () => {
    const owner = await suiNameService.getOwner('pizza.sui');
    expect(owner).toBe(
      '0xcebd22818382953cee22614c0a644e737ea4e8b562911e6745c113b5bcc67934'
    );

    const owner2 = await suiNameService.getOwner(
      'random-92ba7fb-9b35-46bc-ae5d-56b9c63672f3.sui'
    );
    expect(owner2).toBe(null);
  });

  it('should getNames for sui', async () => {
    const names = await suiNameService.getNames(
      '0x3e04ea76cee7d2db4f41c2972ac8d929606d89f7293320f0886abb41a578190c'
    );
    expect(names.some((name) => name === 'bee.sui')).toBe(true);

    const names2 = await suiNameService.getNames(
      '0xf821d3483fc7725ebafaa5a3d12373d49901bdfce1484f219daa7066a30df77d'
    );
    expect(names2.length).toBe(0);
  });

  it('should getOwner for allDomains', async () => {
    const owner = await allDomainsNameService.getOwner('portoflio.solana');
    expect(owner).toBe('tEsT1vjsJeKHw9GH5HpnQszn2LWmjR6q1AVCDCj51nd');

    const owner2 = await allDomainsNameService.getOwner(
      'doesnotexist123456789.letsbonk'
    );
    expect(owner2).toBe(null);
  });

  it('should getNames for allDomains', async () => {
    const names = await allDomainsNameService.getNames(
      'tEsT1vjsJeKHw9GH5HpnQszn2LWmjR6q1AVCDCj51nd'
    );
    expect(names.length).toBeGreaterThan(1);

    const names2 = await allDomainsNameService.getNames(solanaNativeAddress);
    expect(names2.length).toBe(0);
  });

  it('should getOwner for aptos', async () => {
    const owner = await aptosNameService.getOwner('defichecker.apt');
    expect(owner).toBe(
      '0x83699e64ad139e3be9996da314dc5679229e320e292476f33ce00c6681650b8e'
    );

    const owner2 = await aptosNameService.getOwner(
      'random-92ba7fb-9b35-46bc-ae5d-56b9c63672f3.apt'
    );
    expect(owner2).toBe(null);
  });

  it('should getNames for aptos', async () => {
    const names = await aptosNameService.getNames(
      '0x83699e64ad139e3be9996da314dc5679229e320e292476f33ce00c6681650b8e'
    );
    expect(names.some((name) => name === 'defichecker.apt')).toBe(true);

    const names2 = await aptosNameService.getNames(
      '0xf821d3483fc7725ebafaa5a3d12373d49901bdfce1484f219daa7066a30df77d'
    );
    expect(names2.length).toBe(0);
  });

  it('should getOwner for solana', async () => {
    const owner = await bonfidaNameService.getOwner('defichecker.sol');
    expect(owner).toBe('tEsT1vjsJeKHw9GH5HpnQszn2LWmjR6q1AVCDCj51nd');

    const owner2 = await bonfidaNameService.getOwner(
      '53ahj74NffQ3CrFS2YRVgLhgFZtCewjM7eY19jS6Nr6m'
    );
    expect(owner2).toBe(null);
  });

  it('should getNames for solana', async () => {
    const names = await bonfidaNameService.getNames(
      'tEsT1vjsJeKHw9GH5HpnQszn2LWmjR6q1AVCDCj51nd'
    );
    expect(names.some((name) => name === 'defichecker.sol')).toBe(true);

    const names2 = await bonfidaNameService.getNames(
      '53ahj74NffQ3CrFS2YRVgLhgFZtCewjM7eY19jS6Nr6m'
    );
    expect(names2.length).toBe(0);
  });
});
