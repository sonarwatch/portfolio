import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { fetcherGenerator } from './generator';
import { FetcherGeneratorSchema } from './schema.d';

describe('fetcher generator', () => {
  let tree: Tree;
  const options: FetcherGeneratorSchema = {
    fetcherName: 'test',
    pluginId: 'foo',
    networkId: 'solana',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await fetcherGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
