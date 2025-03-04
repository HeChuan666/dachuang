import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

/**
 * 格式化日期为YYYY-MM-DD格式
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * 格式化日期为YYYY-MM-DD HH:mm格式
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd HH:mm');
};

/**
 * 获取相对时间（如：3小时前、2天前）
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 相对时间字符串
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: zhCN
  });
};

/**
 * 格式化相对日期（如：昨天、上周五）
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 相对日期字符串
 */
export const getRelativeDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatRelative(dateObj, new Date(), {
    locale: zhCN
  });
};

/**
 * 判断日期是否是今天
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {boolean} 是否是今天
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();
};