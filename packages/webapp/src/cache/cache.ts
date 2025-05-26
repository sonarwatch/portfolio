import { Cache, getCache } from '@sonarwatch/portfolio-plugins';
import { logger } from '../logger/logger';
import dotenv from 'dotenv';


class PortfolioCache {
  private static instance: PortfolioCache;

  private readonly cache: Cache;

  private constructor() {
    dotenv.config();
    this.cache = getCache();
    logger.info(`Cache initialized. Driver=${this.cache?.driver?.name}`);
  }

  public static getInstance(): PortfolioCache {
    if (!PortfolioCache.instance) {
      PortfolioCache.instance = new PortfolioCache();
    }
    return PortfolioCache.instance;
  }

  public getCache(): Cache {
    return this.cache;
  }
}

export default PortfolioCache.getInstance();
