import * as fs from 'fs';
import * as path from 'path';
import { LOG_LEVELS, type LogLevel } from '../configs/constants.ts';

const LOGS_BASE_PATH = './storages/logs';
const SERVICE_NAME = process.env.SERVICE_NAME || 'app';

const ensureLogDirectory = (date: string): string => {
  const dateDir = path.join(LOGS_BASE_PATH, SERVICE_NAME, date);

  if (!fs.existsSync(dateDir)) {
    fs.mkdirSync(dateDir, { recursive: true });
  }

  return dateDir;
};

const getLogFileName = (level: LogLevel): string => {
  const fileNames: Record<LogLevel, string> = {
    [LOG_LEVELS.DEBUG]: 'debug.txt',
    [LOG_LEVELS.INFO]: 'info.txt',
    [LOG_LEVELS.WARN]: 'warning.txt',
    [LOG_LEVELS.ERROR]: 'errors.txt',
  };
  return fileNames[level];
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]!;
};

const formatTimestamp = (date: Date): string => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

const formatError = (data: unknown): string => {
  if (data === undefined || data === null) {
    return '';
  }

  if (data instanceof Error) {
    let errorStr = `\n  Error: ${data.message}`;
    if (data.stack) {
      errorStr += `\n  Stack: ${data.stack}`;
    }
    return errorStr;
  }

  if (typeof data === 'object') {
    try {
      return `\n  Data: ${JSON.stringify(data, null, 2)}`;
    } catch {
      return `\n  Data: [Unable to stringify]`;
    }
  }

  return `\n  ${String(data)}`;
};

const writeToFile = (level: LogLevel, message: string, data?: unknown): void => {
  const now = new Date();
  const dateStr = formatDate(now);
  const timestamp = formatTimestamp(now);

  const logDir = ensureLogDirectory(dateStr);
  const fileName = getLogFileName(level);
  const filePath = path.join(logDir, fileName);

  let logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (data !== undefined) {
    logEntry += formatError(data);
  }

  logEntry += '\n';

  fs.appendFileSync(filePath, logEntry, 'utf8');
};

const logToConsole = (level: LogLevel, message: string, data?: unknown): void => {
  const timestamp = formatTimestamp(new Date());
  const levelUpper = level.toUpperCase();

  const consoleMethods: Record<LogLevel, (msg: string, ...args: unknown[]) => void> = {
    [LOG_LEVELS.DEBUG]: console.log,
    [LOG_LEVELS.INFO]: console.info,
    [LOG_LEVELS.WARN]: console.warn,
    [LOG_LEVELS.ERROR]: console.error,
  };

  const consoleMethod = consoleMethods[level];

  if (data !== undefined) {
    consoleMethod(`[${timestamp}] [${levelUpper}] ${message}`, data);
  } else {
    consoleMethod(`[${timestamp}] [${levelUpper}] ${message}`);
  }
};

export const logger = {
  debug(message: string, data?: unknown): void {
    writeToFile(LOG_LEVELS.DEBUG, message, data);
    logToConsole(LOG_LEVELS.DEBUG, message, data);
  },

  info(message: string, data?: unknown): void {
    writeToFile(LOG_LEVELS.INFO, message, data);
    logToConsole(LOG_LEVELS.INFO, message, data);
  },

  warn(message: string, data?: unknown): void {
    writeToFile(LOG_LEVELS.WARN, message, data);
    logToConsole(LOG_LEVELS.WARN, message, data);
  },

  error(message: string, data?: unknown): void {
    writeToFile(LOG_LEVELS.ERROR, message, data);
    logToConsole(LOG_LEVELS.ERROR, message, data);
  },
};

export type Logger = typeof logger;
