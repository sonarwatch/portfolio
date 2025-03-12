/**
 * Represents a platform.
 */
export type Platform = {
  id: string;
  name: string;
  description?: string;
  defiLlamaId?: string;
  website?: string;
  image?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  github?: string;
  referral?: string;
  medium?: string;
  documentation?: string;
  isDeprecated?: boolean;
  tokens?: string[];
};
