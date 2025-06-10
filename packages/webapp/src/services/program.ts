import {
  Cache,
  cachedPrograms,
  loadFromCache
} from '@sonarwatch/portfolio-plugins';
import portfolioCache from '../cache/cache';

class ProgramService {
  private static instance: ProgramService;

  private cache: Cache;

  constructor() {
    this.cache = portfolioCache.getCache();
  }

  public static getInstance(): ProgramService {
    if (!ProgramService.instance) {
      ProgramService.instance = new ProgramService();
    }
    return ProgramService.instance;
  }

  public async warmupProgramsCache() {
    for (const program of cachedPrograms) {
      await loadFromCache(program);
    }
  }
}

export default ProgramService.getInstance();
