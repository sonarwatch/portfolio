import { CACHE_CONFIG, ProgramCacheCategory } from './constants';

export function classifyProgram(accountsCount: number): ProgramCacheCategory {
  if (accountsCount <= CACHE_CONFIG.MEDIUM.maxAccounts) {
    return ProgramCacheCategory.MEDIUM;
  }

  if (accountsCount <= CACHE_CONFIG.LARGE.maxAccounts) {
    return ProgramCacheCategory.LARGE;
  }

  return ProgramCacheCategory.DENY;
}
