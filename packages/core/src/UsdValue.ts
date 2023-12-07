/**
 * Represents a value in USD.
 * If it's null, it means that the value is unknown.
 * If it's a number, it means that the value is known.
 * If it's 0, it means that the value is known to be 0$.
 */
export type UsdValue = number | null;
