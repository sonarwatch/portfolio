import { MoveType } from './types';

function splitTypeString(typeString: string): {
  root: string;
  keys?: string;
} {
  const index = typeString.indexOf('<');
  const index2 = typeString.indexOf('>');
  if (index !== -1 && index2 === -1)
    throw new Error(`Type string not splittable: ${typeString}`);
  const root = index === -1 ? typeString : typeString.slice(0, index);
  const keys = index === -1 ? undefined : typeString.slice(index + 1, -1);
  return {
    root,
    keys,
  };
}

function splitRootString(root: string) {
  const splits = root.split('::');
  if (splits.length > 3) throw new Error(`Root type not splittable: ${root}`);
  const address = splits.at(0);
  const module = splits.at(1);
  const struct = splits.at(2);
  if (!address) throw new Error(`Root type not splittable: ${root}`);
  return {
    address,
    module,
    struct,
  };
}

function splitKeysString(keysString: string) {
  let depth = 0;
  const indexes = [];
  for (let i = 0; i < keysString.length; i++) {
    const char = keysString.at(i);
    const nextChar = keysString.at(i + 1);
    if (char === '>') depth -= 1;
    if (char === '<') depth += 1;
    if (depth === 0 && char === ',' && nextChar === ' ') indexes.push(i);
  }
  if (indexes.length === 0) return [keysString];
  const typeStrings = [];
  let cKeysString = keysString;
  let sum = 0;
  for (let i = 0; i < indexes.length; i++) {
    let index = indexes[i];
    index -= sum;
    typeStrings.push(cKeysString.slice(0, index));
    cKeysString = cKeysString.slice(index + 2);
    if (i === indexes.length - 1) {
      typeStrings.push(cKeysString);
    }
    sum += index + 2;
  }
  return typeStrings;
}

export function parseTypeString(typeString: string): MoveType {
  const { root, keys: keysString } = splitTypeString(typeString);
  const { address, module, struct } = splitRootString(root);

  let keys: MoveType[] | undefined;
  if (keysString) {
    const splittedKeys = splitKeysString(keysString);
    keys = splittedKeys.map((cTypeString) => parseTypeString(cTypeString));
  }

  return {
    type: typeString,
    root,
    address,
    module,
    struct,
    keys,
  };
}
