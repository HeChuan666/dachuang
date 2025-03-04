const fs = require('fs');
const path = require('path');

// 创建日志目录
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 日志级别
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// 当前日志级别（从环境变量中获取，默认为INFO）
const currentLogLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
const logLevelValue = {
  [LOG_LEVELS.ERROR]: 0,
  [LOG_LEVELS.WARN]: 1,
  [LOG_LEVELS.INFO]: 2,
  [LOG_LEVELS.DEBUG]: 3
};

/**
 * 格式化日期为YYYY-MM-DD格式
 * @returns {string} 格式化后的日期字符串
 */
const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 格式化时间为YYYY-MM-DD HH:mm:ss.SSS格式
 * @returns {string} 格式化后的时间字符串
 */
const getFormattedTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  return `${getFormattedDate()} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

/**
 * 写入日志到文件
 * @param {string} level - 日志级别
 * @param {string} message - 日志消息
 * @param {object} meta - 元数据
 */
const writeLog = (level, message, meta = {}) => {
  // 检查当前日志级别是否需要记录
  if (logLevelValue[level] > logLevelValue[currentLogLevel]) {
    return;
  }
  
  const formattedDate = getFormattedDate();
  const formattedTime = getFormattedTime();
  const logFilePath = path.join(logDir, `${formattedDate}.log`);
  
  let metaString = '';
  if (Object.keys(meta).length > 0) {
    try {
      metaString = JSON.stringify(meta);
    } catch (e) {
      metaString = '[无法序列化的元数据]';
    }
  }
  
  const logEntry = `[${formattedTime}] [${level}] ${message} ${metaString}\n`;
  
  // 同步写入日志文件（在生产环境中可能需要考虑异步写入和日志轮转）
  try {
    fs.appendFileSync(logFilePath, logEntry);
  } catch (error) {
    console.error('写入日志文件时出错:', error);
  }
  
  // 同时输出到控制台
  const consoleMethod = level === LOG_LEVELS.ERROR ? 'error' :
                         level === LOG_LEVELS.WARN ? 'warn' :
                         level === LOG_LEVELS.INFO ? 'info' : 'log';
  
  console[consoleMethod](`[${level}] ${message}`, meta);
};

/**
 * 记录错误日志
 * @param {string} message - 日志消息
 * @param {object} meta - 元数据
 */
const error = (message, meta = {}) => {
  writeLog(LOG_LEVELS.ERROR, message, meta);
};

/**
 * 记录警告日志
 * @param {string} message - 日志消息
 * @param {object} meta - 元数据
 */
const warn = (message, meta = {}) => {
  writeLog(LOG_LEVELS.WARN, message, meta);
};

/**
 * 记录信息日志
 * @param {string} message - 日志消息
 * @param {object} meta - 元数据
 */
const info = (message, meta = {}) => {
  writeLog(LOG_LEVELS.INFO, message, meta);
};

/**
 * 记录调试日志
 * @param {string} message - 日志消息
 * @param {object} meta - 元数据
 */
const debug = (message, meta = {}) => {
  writeLog(LOG_LEVELS.DEBUG, message, meta);
};

/**
 * 记录HTTP请求日志
 * @param {object} req - 请求对象
 * @param {object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const httpLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // 记录请求开始
  info(`${req.method} ${req.originalUrl} - 开始请求`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  // 监听响应完成事件
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // 记录请求完成
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    const logger = logLevel === 'error' ? error : info;
    
    logger(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: duration,
      contentLength: res.get('Content-Length')
    });
  });
  
  next();
};

module.exports = {
  error,
  warn,
  info,
  debug,
  httpLogger
};