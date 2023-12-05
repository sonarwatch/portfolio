/**
 * Represents the address systems.
 */
export const AddressSystem = {
  solana: 'solana',
  bitcoin: 'bitcoin',
  evm: 'evm',
  move: 'move',
  sei: 'sei',
} as const;

/**
 * Represents the type of address system.
 */
export type AddressSystemType =
  (typeof AddressSystem)[keyof typeof AddressSystem];
