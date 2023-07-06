import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { jobGenerator } from './generator';
import { JobGeneratorSchema } from './schema.d';

describe('job generator', () => {
  let tree: Tree;
  const options: JobGeneratorSchema = { jobName: 'test', pluginId: 'foo' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await jobGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
