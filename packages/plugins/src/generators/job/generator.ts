import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { JobGeneratorSchema } from './schema.d';
import { toKebabCase } from '../helpers';

export async function jobGenerator(tree: Tree, options: JobGeneratorSchema) {
  const { pluginId } = options;
  const jobName = toKebabCase(options.jobName);
  const libraryRoot = readProjectConfiguration(tree, 'plugins').root;
  const substitutions = {
    pluginId,
    jobName,
  };

  generateFiles(
    tree,
    path.join(__dirname, 'common'),
    libraryRoot,
    substitutions
  );
  await formatFiles(tree);
}

export default jobGenerator;
