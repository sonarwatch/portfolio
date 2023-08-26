import { parseTypeString } from '../aptos';

export default function getFormattedCollectionNameAndId(type: string): {
  collectionName: string | undefined;
  collectionId: string | undefined;
} {
  const types = parseTypeString(type);

  let module;
  let tempTypes = types;
  while (tempTypes.struct && tempTypes.keys && tempTypes.keys.length === 1) {
    module = module ? `${module} ${tempTypes.struct}` : tempTypes.struct;
    [tempTypes] = tempTypes.keys;
  }
  module = module ? `${module} ${tempTypes.struct}` : tempTypes.struct;

  return {
    collectionName: module,
    collectionId: types.type,
  };
}
