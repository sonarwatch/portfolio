import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../logger/logger';
import portfolioService from '../services/portfolio';

const initPortfolioRoutes = (app: FastifyInstance) => {
  app.get(
    '/api/v1/addresses/:address/portfolio',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            address: { type: 'string' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { address } = req.params as any;
      logger.info(`Portfolio requested. Address: ${address}`);
      const result = await portfolioService.getPortfolio(address);
      return reply.send(result);
    },
  );

  app.get(
    '/api/v1/addresses/:address/portfolio/:fetcher',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            address: { type: 'string' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { address, fetcher } = req.params as any;
      logger.info(
        `Portfolio for fetcher requested. Address: ${address} Fetcher: ${fetcher}`
      );
      const result = await portfolioService.getDefiPortfolio(address, fetcher);
      return reply.send(result);
    }
  );
};

export { initPortfolioRoutes };
