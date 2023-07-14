import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { existsSync } from 'node:fs';
import * as path from 'path';
import { assertNetworkId } from '@sonarwatch/portfolio-core';
import { FetcherGeneratorSchema } from './schema.d';
import {
  idToPascalCase,
  idToSpacedPascalCase,
  lowerFirstLetter,
  toKebabCase,
} from '../helpers';

export async function fetcherGenerator(
  tree: Tree,
  options: FetcherGeneratorSchema
) {
  const name = toKebabCase(options.fetcherName);
  const pluginId = toKebabCase(options.pluginId);
  const { networkId } = options;
  assertNetworkId(networkId);

  const libraryRoot = readProjectConfiguration(tree, 'plugins').root;

  if (!existsSync(`${libraryRoot}/src/plugins/${pluginId}`)) {
    throw new Error(`The provided plugin does not exist: ${pluginId}`);
  }

  const substitutions = {
    pluginId,
    name,
    pascalCaseName: idToPascalCase(name),
    spacedPascalCaseName: idToSpacedPascalCase(name),
    loweredPascalCaseName: lowerFirstLetter(idToPascalCase(name)),
    networkId,
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    libraryRoot,
    substitutions
  );
  await formatFiles(tree);
}

export default fetcherGenerator;
