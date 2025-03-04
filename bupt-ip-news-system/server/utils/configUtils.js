/**
 * 配置工具函数
 * 用于加载和验证应用配置
 */
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

/**
 * 加载环境变量配置
 * @param {string} envPath - 环境变量文件路径
 */
const loadEnvConfig = (envPath = '.env') => {
  const envFile = path.resolve(process.cwd(), envPath);
  
  // 检查环境变量文件是否存在
  if (fs.existsSync(envFile)) {
    // 加载环境变量
    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    
    // 将环境变量添加到process.env中
    Object.keys(envConfig).forEach(key => {
      if (process.env[key] === undefined) {
        process.env[key] = envConfig[key];
      }
    });
    
    console.log(`已加载环境配置文件: ${envPath}`);
  } else {
    console.warn(`环境配置文件不存在: ${envPath}`);
  }
};

/**
 * 验证必需的环境变量
 * @param {string[]} requiredVars - 必需的环境变量数组
 * @returns {boolean} 验证是否通过
 */
const validateRequiredEnvVars = (requiredVars = []) => {
  let missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.error('缺少必需的环境变量:', missingVars.join(', '));
    return false;
  }
  
  return true;
};

/**
 * 获取配置值
 * @param {string} key - 配置键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 配置值
 */
const getConfig = (key, defaultValue = null) => {
  return process.env[key] !== undefined ? process.env[key] : defaultValue;
};

/**
 * 获取数字类型的配置值
 * @param {string} key - 配置键名
 * @param {number} defaultValue - 默认值
 * @returns {number} 数字配置值
 */
const getNumberConfig = (key, defaultValue = 0) => {
  const value = process.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * 获取布尔类型的配置值
 * @param {string} key - 配置键名
 * @param {boolean} defaultValue - 默认值
 * @returns {boolean} 布尔配置值
 */
const getBooleanConfig = (key, defaultValue = false) => {
  const value = process.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  return ['true', 'yes', '1', 'on'].includes(value.toLowerCase());
};

/**
 * 判断是否是生产环境
 * @returns {boolean} 是否是生产环境
 */
const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * 判断是否是开发环境
 * @returns {boolean} 是否是开发环境
 */
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
};

/**
 * 判断是否是测试环境
 * @returns {boolean} 是否是测试环境
 */
const isTest = () => {
  return process.env.NODE_ENV === 'test';
};

/**
 * 初始化应用配置
 * @param {object} options - 配置选项
 * @param {string} options.envPath - 环境变量文件路径
 * @param {string[]} options.requiredVars - 必需的环境变量数组
 * @returns {boolean} 初始化是否成功
 */
const initConfig = (options = {}) => {
  const { envPath = '.env', requiredVars = [] } = options;
  
  // 加载环境变量
  loadEnvConfig(envPath);
  
  // 根据环境加载特定的配置文件
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envSpecificPath = `.env.${nodeEnv}`;
  loadEnvConfig(envSpecificPath);
  
  // 本地开发配置（不提交到版本控制）
  loadEnvConfig('.env.local');
  
  // 验证必需的环境变量
  return validateRequiredEnvVars(requiredVars);
};

module.exports = {
  loadEnvConfig,
  validateRequiredEnvVars,
  getConfig,
  getNumberConfig,
  getBooleanConfig,
  isProduction,
  isDevelopment,
  isTest,
  initConfig
};