import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { PluginGeneratorSchema } from './schema.d';
import { toKebabCase } from '../helpers';

function trimAndUpper(text: string) {
  return text.replace(/-/, '').toUpperCase();
}
function spaceAndUpper(text: string) {
  return text.replace(/-/, ' ').toUpperCase();
}
function lowerFirstLetter(string: string): string {
  return string.charAt(0).toLocaleLowerCase() + string.slice(1);
}

function idToPascalCase(id: string) {
  return id.replace(/(^\w|-\w)/g, trimAndUpper);
}

function idToSpacedPascalCase(id: string) {
  return id.replace(/(^\w|-\w)/g, spaceAndUpper);
}

export async function pluginGenerator(
  tree: Tree,
  options: PluginGeneratorSchema
) {
  const id = toKebabCase(options.id);
  const libraryRoot = readProjectConfiguration(tree, 'plugins').root;
  const { addJob, addFetcher } = options;

  const substitutions = {
    id,
    pascalCaseId: idToPascalCase(id),
    spacedPascalCaseId: idToSpacedPascalCase(id),
    loweredPascalCaseId: lowerFirstLetter(idToPascalCase(id)),
    addJob,
    addFetcher,
  };

  generateFiles(
    tree,
    path.join(__dirname, 'common'),
    libraryRoot,
    substitutions
  );

  if (addJob) {
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'addJob'),
      libraryRoot,
      substitutions
    );
  }

  if (addFetcher) {
    generateFiles(
      tree,
      path.join(__dirname, 'files', 'addFetcher'),
      libraryRoot,
      substitutions
    );
  }

  await formatFiles(tree);
}

export default pluginGenerator;
