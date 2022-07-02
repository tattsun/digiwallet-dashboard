import log4js from 'log4js';

export const accessLogger = log4js.getLogger('web');
accessLogger.level = 'debug';

export const logger = log4js.getLogger();
logger.level = 'info';
