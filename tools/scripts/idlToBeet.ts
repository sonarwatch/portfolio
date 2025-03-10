import * as fs from 'fs';
import * as path from 'path';

// Check if an IDL path is provided
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('❌ Usage: ts-node idlToBeet.ts <path_to_idl.json>');
  process.exit(1);
}

const idlPath = path.resolve(args[0]);
if (!fs.existsSync(idlPath)) {
  console.error(`❌ File not found: ${idlPath}`);
  process.exit(1);
}

// Load the IDL
const idl: any = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));

// Get the directory and filename
const idlDir = path.dirname(idlPath);
const idlFilename = path.basename(idlPath, '.json'); // Remove .json extension
const outputPath = path.join(idlDir, `${idlFilename}_beets.ts`);

// Define type mappings for Beet and TypeScript
const bigNumberTypes = new Set([
  'f32',
  'f64',
  'u64',
  'u128',
  'u256',
  'u512',
  'i64',
  'i128',
  'i256',
  'i512',
  'i80f48',
]);

const typeMap: Record<string, { beetType: string; tsType: string }> = {
  pubkey: { beetType: 'publicKey', tsType: 'PublicKey' },
  u8: { beetType: 'u8', tsType: 'number' },
  u16: { beetType: 'u16', tsType: 'number' },
  u32: { beetType: 'u32', tsType: 'number' },
  bool: { beetType: 'bool', tsType: 'boolean' },
  string: { beetType: 'blob(32)', tsType: 'Buffer' },
};

// Add BigNumber types dynamically
bigNumberTypes.forEach((type) => {
  typeMap[type] = { beetType: type, tsType: 'BigNumber' };
});

// Convert a name to camelCase
const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

// Convert a name to PascalCase
const toPascalCase = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Detect required imports
let imports = new Set<string>();
let solanaImports = new Set<string>();

// Extract the Beet and TypeScript types from an IDL field
function getType(
  field: any,
  isEnum: boolean = false
): { beetType: string; tsType: string; isFixable: boolean } {
  if (typeof field.type === 'string') {
    if (!typeMap[field.type]) {
      console.error(`❌ Error: Unknown type '${field.type}'`);
      process.exit(1);
    }
    if (field.type === 'pubkey') {
      imports.add(
        "import { publicKey } from '@metaplex-foundation/beet-solana';"
      );
      imports.add("import { PublicKey } from '@solana/web3.js';");
    } else if (bigNumberTypes.has(field.type)) {
      solanaImports.add(field.type);
    } else {
      imports.add(
        `import { ${
          typeMap[field.type].beetType
        } } from '@metaplex-foundation/beet';`
      );
    }
    return { ...typeMap[field.type], isFixable: false };
  } else if (field.type.defined) {
    // Handle enums and defined types
    const typeName = toPascalCase(field.type.defined.name);
    return {
      beetType: isEnum ? 'u8' : `${toCamelCase(typeName)}Struct`,
      tsType: typeName,
      isFixable: false,
    };
  } else if (field.type.array) {
    // Handle fixed-size arrays
    const arrayType = field.type.array[0]; // Element type
    const arraySize = field.type.array[1]; // Array length

    if (typeof arrayType === 'string') {
      if (!typeMap[arrayType]) {
        console.error(`❌ Error: Unknown array type '${arrayType}'`);
        process.exit(1);
      }
      imports.add(
        "import { uniformFixedSizeArray } from '@metaplex-foundation/beet';"
      );
      return {
        beetType: `uniformFixedSizeArray(${typeMap[arrayType].beetType}, ${arraySize})`,
        tsType: `${typeMap[arrayType].tsType}[]`,
        isFixable: true,
      };
    } else if (arrayType.defined) {
      const elementType = toPascalCase(arrayType.defined.name);
      imports.add(
        "import { uniformFixedSizeArray } from '@metaplex-foundation/beet';"
      );
      return {
        beetType: `uniformFixedSizeArray(${toCamelCase(
          elementType
        )}Struct, ${arraySize})`,
        tsType: `${elementType}[]`,
        isFixable: true,
      };
    }
  }

  console.error(`❌ Error: Unsupported type '${JSON.stringify(field.type)}'`);
  process.exit(1);
}

// Generate BeetStructs and Enums
function generateBeetStructsAndEnums(idl: any): string {
  let output = '';

  // Generate enums
  idl.types?.forEach((typeDef: any) => {
    if (typeDef.type.kind === 'enum') {
      const enumName = toPascalCase(typeDef.name);
      const variants = typeDef.type.variants
        .map((variant: any) => `  ${toPascalCase(variant.name)},`)
        .join('\n');
      output += `\nexport enum ${enumName} {\n${variants}\n}\n`;
    }
  });

  // Generate structs for accounts and types
  const generateStruct = (typeDef: any, isAccount: boolean) => {
    const structName = toCamelCase(typeDef.name);
    let fields = isAccount
      ? `    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],\n`
      : '';
    let usesFixableBeetStruct = isAccount;

    fields += typeDef.type.fields
      .map((field: any) => {
        const isEnum = idl.types?.some(
          (t: any) =>
            t.name === field.type.defined?.name && t.type.kind === 'enum'
        );
        const { beetType, isFixable } = getType(field, isEnum);
        if (isFixable) usesFixableBeetStruct = true;
        return `    ['${field.name}', ${beetType}],`;
      })
      .join('\n');

    if (isAccount) {
      imports.add(
        "import { uniformFixedSizeArray } from '@metaplex-foundation/beet';"
      );
    }

    const structType = usesFixableBeetStruct
      ? 'FixableBeetStruct'
      : 'BeetStruct';
    if (usesFixableBeetStruct) {
      imports.add(
        "import { FixableBeetStruct } from '@metaplex-foundation/beet';"
      );
    } else {
      imports.add("import { BeetStruct } from '@metaplex-foundation/beet';");
    }

    output += `
export type ${toPascalCase(structName)} = {
  ${isAccount ? 'accountDiscriminator: number[];\n  ' : ''}${typeDef.type.fields
      .map((field: any) => {
        const isEnum = idl.types?.some(
          (t: any) =>
            t.name === field.type.defined?.name && t.type.kind === 'enum'
        );
        const { tsType } = getType(field, isEnum);
        return `${field.name}: ${tsType};`;
      })
      .join('\n  ')}
};

export const ${structName}Struct = new ${structType}<${toPascalCase(
      structName
    )}>(
  [
${fields}
  ],
  (args) => args as ${toPascalCase(structName)}
);\n`;
  };

  idl.accounts?.forEach((account: any) => {
    const typeDef = idl.types?.find((t: any) => t.name === account.name);
    if (typeDef) generateStruct(typeDef, true);
  });

  idl.types?.forEach((typeDef: any) => {
    if (
      typeDef.type.kind === 'struct' &&
      !idl.accounts?.some((account: any) => account.name === typeDef.name)
    ) {
      generateStruct(typeDef, false);
    }
  });

  return Array.from(imports).join('\n') + '\n' + output;
}

// Generate and save the output file
fs.writeFileSync(outputPath, generateBeetStructsAndEnums(idl));
console.log(`✅ Beet structs and enums generated successfully: ${outputPath}`);
