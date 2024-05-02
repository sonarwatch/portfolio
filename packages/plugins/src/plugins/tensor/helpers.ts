import powerUsers from './powerUsers.json';

export function findPowerUserAllocation(owner: string) {
  const users: { [key: string]: number } = powerUsers;
  const amount = users[owner];
  if (!amount) return undefined;
  return amount;
}
