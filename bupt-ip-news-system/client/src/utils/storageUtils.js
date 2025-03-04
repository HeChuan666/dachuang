/**
 * 存储数据到localStorage
 * @param {string} key - 存储的键名
 * @param {any} value - 要存储的值
 */
export const setLocalStorage = (key, value) => {
    try {
      // 对象和数组需要序列化
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('LocalStorage存储出错:', error);
    }
  };
  
  /**
   * 从localStorage获取数据
   * @param {string} key - 存储的键名
   * @param {any} defaultValue - 默认值，如果未找到数据则返回此值
   * @returns {any} 存储的值或默认值
   */
  export const getLocalStorage = (key, defaultValue = null) => {
    try {
      const serializedValue = localStorage.getItem(key);
      
      if (serializedValue === null) {
        return defaultValue;
      }
      
      // 尝试解析为JSON对象
      try {
        return JSON.parse(serializedValue);
      } catch (e) {
        // 如果不是JSON格式，则直接返回字符串
        return serializedValue;
      }
    } catch (error) {
      console.error('LocalStorage获取出错:', error);
      return defaultValue;
    }
  };
  
  /**
   * 从localStorage移除数据
   * @param {string} key - 要删除的键名
   */
  export const removeLocalStorage = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage移除出错:', error);
    }
  };
  
  /**
   * 清空localStorage中的所有数据
   */
  export const clearLocalStorage = () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage清空出错:', error);
    }
  };
  
  /**
   * 存储数据到sessionStorage
   * @param {string} key - 存储的键名
   * @param {any} value - 要存储的值
   */
  export const setSessionStorage = (key, value) => {
    try {
      // 对象和数组需要序列化
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('SessionStorage存储出错:', error);
    }
  };
  
  /**
   * 从sessionStorage获取数据
   * @param {string} key - 存储的键名
   * @param {any} defaultValue - 默认值，如果未找到数据则返回此值
   * @returns {any} 存储的值或默认值
   */
  export const getSessionStorage = (key, defaultValue = null) => {
    try {
      const serializedValue = sessionStorage.getItem(key);
      
      if (serializedValue === null) {
        return defaultValue;
      }
      
      // 尝试解析为JSON对象
      try {
        return JSON.parse(serializedValue);
      } catch (e) {
        // 如果不是JSON格式，则直接返回字符串
        return serializedValue;
      }
    } catch (error) {
      console.error('SessionStorage获取出错:', error);
      return defaultValue;
    }
  };
  
  /**
   * 从sessionStorage移除数据
   * @param {string} key - 要删除的键名
   */
  export const removeSessionStorage = (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('SessionStorage移除出错:', error);
    }
  };
  
  /**
   * 清空sessionStorage中的所有数据
   */
  export const clearSessionStorage = () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('SessionStorage清空出错:', error);
    }
  };