import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { PluginGeneratorSchema } from './schema.d';
import {
  idToPascalCase,
  idToSpacedPascalCase,
  lowerFirstLetter,
  toKebabCase,
} from '../helpers';

export async function pluginGenerator(
  tree: Tree,
  options: PluginGeneratorSchema
) {
  const id = toKebabCase(options.id);
  const libraryRoot = readProjectConfiguration(tree, 'plugins').root;

  const substitutions = {
    id,
    pascalCaseId: idToPascalCase(id),
    spacedPascalCaseId: idToSpacedPascalCase(id),
    loweredPascalCaseId: lowerFirstLetter(idToPascalCase(id)),
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    libraryRoot,
    substitutions
  );
  await formatFiles(tree);
}

export default pluginGenerator;
