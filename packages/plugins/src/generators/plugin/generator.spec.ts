import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { NetworkId } from '@sonarwatch/portfolio-core';
import { pluginGenerator } from './generator';
import { PluginGeneratorSchema } from './schema.d';

describe('plugin generator', () => {
  let tree: Tree;
  const options: PluginGeneratorSchema = {
    id: 'test',
    networkIds: [NetworkId.solana],
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await pluginGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
