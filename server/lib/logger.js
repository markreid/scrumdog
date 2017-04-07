/**
 * logger.
 * log with winston.
 */

const winston = require('winston');
const moment = require('moment');

const level = process.env.LOG_LEVEL || 'info';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      timestamp: () => moment().format('MMM D H:mm:s'),
      // formatter: opts => `${opts.timestamp()} ${opts.level.toUpperCase()} ${opts.message}`,
      prettyPrint: true,
    }),
  ],
});

// cli mode
logger.cli();

// pipe morgan's request logs to debug
logger.morganStream = {
  write: logger.debug,
};


logger.info(`logger initialised with level ${level.toUpperCase()}`);

module.exports = logger;
