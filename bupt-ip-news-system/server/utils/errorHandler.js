/**
 * 封装错误处理类
 * 统一处理不同类型的错误
 */
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;  // 标记为可预见的操作错误
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * 处理Mongoose的CastError（无效ID等）
   * @param {Error} err - 错误对象
   * @returns {AppError} 格式化的错误
   */
  const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  };
  
  /**
   * 处理Mongoose的ValidationError（字段验证失败）
   * @param {Error} err - 错误对象
   * @returns {AppError} 格式化的错误
   */
  const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
  
  /**
   * 处理MongoDB的重复键错误
   * @param {Error} err - 错误对象
   * @returns {AppError} 格式化的错误
   */
  const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new AppError(message, 400);
  };
  
  /**
   * 处理JWT验证错误
   * @param {Error} err - 错误对象
   * @returns {AppError} 格式化的错误
   */
  const handleJWTError = () => new AppError('无效的令牌，请重新登录', 401);
  
  /**
   * 处理JWT过期错误
   * @param {Error} err - 错误对象
   * @returns {AppError} 格式化的错误
   */
  const handleJWTExpiredError = () => new AppError('您的登录已过期，请重新登录', 401);
  
  /**
   * 开发环境错误处理函数
   * @param {Error} err - 错误对象
   * @param {object} res - Express响应对象
   */
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  };
  
  /**
   * 生产环境错误处理函数
   * @param {Error} err - 错误对象
   * @param {object} res - Express响应对象
   */
  const sendErrorProd = (err, res) => {
    // 可预见的操作错误，发送详细消息给客户端
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // 未知错误，不向客户端泄露详细信息
      console.error('ERROR 💥', err);
      
      res.status(500).json({
        status: 'error',
        message: '出现错误，请稍后再试'
      });
    }
  };
  
  /**
   * 全局错误处理中间件
   */
  const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;
  
      // 处理特定类型的错误
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
      sendErrorProd(error, res);
    }
  };
  
  /**
   * 异步函数错误捕获包装器
   * 避免在异步函数中使用try-catch
   * @param {Function} fn - 异步函数
   * @returns {Function} 包装后的函数
   */
  const catchAsync = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  
  module.exports = {
    AppError,
    catchAsync,
    globalErrorHandler
  };