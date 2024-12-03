import { splitGenericParameters } from '@mysten/bcs';

const SUI_ADDRESS_LENGTH = 32;

export function normalizeSuiAddress(value: string, forceAdd0x = false): string {
  let address = value.toLowerCase();
  if (!forceAdd0x && address.startsWith('0x')) {
    address = address.slice(2);
  }
  return `0x${address.padStart(SUI_ADDRESS_LENGTH * 2, '0')}`;
}

export function normalizeSuiObjectId(
  value: string,
  forceAdd0x = false
): string {
  return normalizeSuiAddress(value, forceAdd0x);
}

function parseTypeTag(type: string): string | StructTag {
  if (!type.includes('::')) return type;

  return parseStructTag(type);
}

function parseStructTag(type: string): StructTag {
  const [address, module] = type.split('::');

  const rest = type.slice(address.length + module.length + 4);
  const name = rest.includes('<') ? rest.slice(0, rest.indexOf('<')) : rest;
  const typeParams = rest.includes('<')
    ? splitGenericParameters(
        rest.slice(rest.indexOf('<') + 1, rest.lastIndexOf('>'))
      ).map((typeParam) => parseTypeTag(typeParam.trim()))
    : [];

  return {
    address: normalizeSuiAddress(address),
    module,
    name,
    typeParams,
  };
}

type StructTag = {
  address: string;
  module: string;
  name: string;
  typeParams: (string | StructTag)[];
};

export function normalizeStructTag(type: string | StructTag): string {
  const { address, module, name, typeParams } =
    typeof type === 'string' ? parseStructTag(type) : type;

  const formattedTypeParams =
    typeParams?.length > 0
      ? `<${typeParams
          .map((typeParam) =>
            typeof typeParam === 'string'
              ? typeParam
              : normalizeStructTag(typeParam)
          )
          .join(',')}>`
      : '';

  return `${address}::${module}::${name}${formattedTypeParams}`;
}
