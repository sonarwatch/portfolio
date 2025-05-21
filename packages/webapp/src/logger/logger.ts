import pino from 'pino';

const logger = pino({
  level: process.env['LOG_LEVEL'] || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      singleLine: true,
    },
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  serializers: {
    error: pino.stdSerializers.errWithCause,
  },
});

const fastifyLogger = {
  level: process.env['LOG_LEVEL'] || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      singleLine: true,
    },
  },
};

export { logger, fastifyLogger };
