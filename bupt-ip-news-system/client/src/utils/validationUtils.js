/**
 * 验证电子邮件格式
 * @param {string} email - 电子邮件地址
 * @returns {boolean} 是否是有效的电子邮件
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * 验证密码强度
   * @param {string} password - 密码
   * @returns {object} 包含强度评分和反馈信息的对象
   */
  export const validatePasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        feedback: '请输入密码'
      };
    }
    
    let score = 0;
    let feedback = '';
    
    // 长度检查
    if (password.length < 6) {
      feedback = '密码太短，至少需要6个字符';
    } else if (password.length >= 6 && password.length < 10) {
      score += 1;
    } else if (password.length >= 10) {
      score += 2;
    }
    
    // 包含数字
    if (/\d/.test(password)) {
      score += 1;
    }
    
    // 包含小写字母
    if (/[a-z]/.test(password)) {
      score += 1;
    }
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) {
      score += 1;
    }
    
    // 包含特殊字符
    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 1;
    }
    
    // 生成反馈信息
    if (score <= 2) {
      feedback = '弱：建议使用更复杂的密码';
    } else if (score <= 4) {
      feedback = '中等：可以考虑添加更多类型的字符';
    } else {
      feedback = '强：密码强度很好';
    }
    
    return {
      score,  // 0-6分
      feedback
    };
  };
  
  /**
   * 验证中国手机号格式
   * @param {string} phone - 手机号码
   * @returns {boolean} 是否是有效的手机号
   */
  export const isValidChinesePhone = (phone) => {
    if (!phone) return false;
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * 验证URL格式
   * @param {string} url - URL地址
   * @returns {boolean} 是否是有效的URL
   */
  export const isValidUrl = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * 验证表单字段
   * @param {object} values - 表单值对象
   * @param {object} rules - 验证规则
   * @returns {object} 错误信息对象
   */
  export const validateForm = (values, rules) => {
    const errors = {};
    
    // 遍历规则
    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field];
      let value = values[field];
      
      if (fieldRules.required && (!value || value.trim() === '')) {
        errors[field] = `${fieldRules.label || field}不能为空`;
        return;
      }
      
      if (value) {
        // 最小长度验证
        if (fieldRules.minLength && value.length < fieldRules.minLength) {
          errors[field] = `${fieldRules.label || field}至少需要${fieldRules.minLength}个字符`;
          return;
        }
        
        // 最大长度验证
        if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
          errors[field] = `${fieldRules.label || field}不能超过${fieldRules.maxLength}个字符`;
          return;
        }
        
        // 模式验证
        if (fieldRules.pattern && !new RegExp(fieldRules.pattern).test(value)) {
          errors[field] = fieldRules.message || `${fieldRules.label || field}格式不正确`;
          return;
        }
        
        // 邮箱验证
        if (fieldRules.isEmail && !isValidEmail(value)) {
          errors[field] = `请输入有效的电子邮箱地址`;
          return;
        }
        
        // 自定义验证
        if (fieldRules.validator && typeof fieldRules.validator === 'function') {
          const validationResult = fieldRules.validator(value, values);
          if (validationResult) {
            errors[field] = validationResult;
            return;
          }
        }
      }
    });
    
    return errors;
  };