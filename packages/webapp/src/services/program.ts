import { cachedPrograms, loadFromCache } from '@sonarwatch/portfolio-plugins';
import { logger } from '../logger/logger';

class ProgramService {
  private static instance: ProgramService;

  public static getInstance(): ProgramService {
    if (!ProgramService.instance) {
      ProgramService.instance = new ProgramService();
    }
    return ProgramService.instance;
  }

  public async warmupProgramsCache() {
    const cacheLevel = process.env['PROGRAMS_CACHE_LEVEL'];
    if (cacheLevel !== 'MEMORY') {
      logger.info(
        `Warmup for programs is not required. CacheType=${cacheLevel}`
      );
      return;
    }

    for (const program of cachedPrograms) {
      await loadFromCache(program);
    }
  }
}

export default ProgramService.getInstance();
