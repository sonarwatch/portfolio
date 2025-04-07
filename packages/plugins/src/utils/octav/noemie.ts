import { formatEvmAddress } from '@sonarwatch/portfolio-core';

// Function to format an array of addresses
function formatAddresses(addresses: string[]) {
  return addresses.map((address) => formatEvmAddress(address));
}

// Example usage
const inputAddresses = [
  '0xB2374f84b3cEeFF6492943Df613C9BcF45322a0c',
  '0x8658047E48CC09161f4152C79155dAc1D710ff0A',
  '0xF380F025675A868eD5614a1Dd77c6b05f4147004',
];

const formattedAddresses = formatAddresses(inputAddresses);

console.log(formattedAddresses);
