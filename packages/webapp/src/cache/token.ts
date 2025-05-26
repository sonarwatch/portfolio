import dotenv from 'dotenv';
import {
  getJobs,
  SolanaFetcher,
  TokenRegistry,
} from '@sonarwatch/token-registry';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { logger } from '../logger/logger';

class TokenCache {
  private static instance: TokenCache;

  private readonly registry: TokenRegistry;

  private constructor() {
    dotenv.config();
    this.registry = new TokenRegistry({
      redisOptions: {
        url: process.env['CACHE_CONFIG_REDIS_URL'],
      },
      fetchers: {
        [NetworkId.solana]: new SolanaFetcher(
          process.env['PORTFOLIO_SOLANA_DAS_ENDPOINT']!
        ),
      },
    });
    logger.info(`Token cache initialized.`);
  }

  public static getInstance(): TokenCache {
    if (!TokenCache.instance) {
      TokenCache.instance = new TokenCache();
    }
    return TokenCache.instance;
  }

  public async initRegistry() {
    const jobs = getJobs();
    const jupiter = jobs.find((j) => j.id === 'jupiter');
    logger.info(`Initializing tokens registry. Job=${jupiter}`);
    if (jupiter) {
      logger.info(`Loading tokens...`);
      try {
        const tokens = await jupiter.jobFct();
        logger.info(`Tokens are loaded. Count=${tokens?.length}`);

        const chunkSize = 50;
        for (let i = 0; i < tokens.length; i += chunkSize) {
          const chunk = tokens.slice(i, i + chunkSize);

          await Promise.all(
            chunk.map(async (token) => {
              await this.registry.addToken(
                token.address,
                NetworkId.solana,
                token
              );
            })
          );

          if (i % 10000 === 0) {
            logger.info(`Tokens added to cache. Count=${i}`);
          }
        }

      } catch (err) {
        logger.error({ error: err }, 'Failed to load tokens.');
      }
    }
  }

  public getRegistry(): TokenRegistry {
    return this.registry;
  }
}

export default TokenCache.getInstance();
