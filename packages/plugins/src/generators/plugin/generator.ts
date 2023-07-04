import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { PluginGeneratorSchema } from './schema.d';

const toKebabCaseRegexp =
  /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

function toKebabCase(str: string): string {
  if (!str) return '';
  return (
    str
      .match(toKebabCaseRegexp)
      ?.map((x) => x.toLowerCase())
      .join('-') || ''
  );
}

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
  generateFiles(tree, path.join(__dirname, 'files'), libraryRoot, {
    id,
    networkIds: options.networkIds,
    pascalCaseId: idToPascalCase(id),
    spacedPascalCaseId: idToSpacedPascalCase(id),
    loweredPascalCaseId: lowerFirstLetter(idToPascalCase(id)),
  });
  await formatFiles(tree);
}

export default pluginGenerator;
