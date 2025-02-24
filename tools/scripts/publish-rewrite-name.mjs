import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// e.g. projectName = "core" or "plugins"
const [,, projectName] = process.argv;

const distDir = join(process.cwd(), 'dist', 'packages', projectName);

const pkgPath = join(distDir, 'package.json');
const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8'));

pkgJson.name = pkgJson.name.replace('@sonarwatch/', '@octavlabs/');

writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2), 'utf8');

// execSync('npm publish --verbose --access public --otp 123456', {
execSync('npm publish --verbose --access restricted', {
  cwd: distDir,
  stdio: 'inherit',
});
