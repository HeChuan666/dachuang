/**
 * 截取字符串并添加省略号
 * @param {string} str - 原始字符串
 * @param {number} maxLength - 最大长度
 * @returns {string} 截取后的字符串
 */
export const truncateString = (str, maxLength = 100) => {
    if (!str) return '';
    
    if (str.length <= maxLength) return str;
    
    return str.slice(0, maxLength) + '...';
  };
  
  /**
   * 高亮字符串中的关键词
   * @param {string} text - 原始文本
   * @param {string} keyword - 关键词
   * @returns {string} 包含高亮HTML的字符串
   */
  export const highlightKeyword = (text, keyword) => {
    if (!text || !keyword) return text;
    
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };
  
  /**
   * 将Markdown格式转换为HTML格式的简化函数
   * 注意：这是一个简化版本，对于复杂的Markdown文档，推荐使用marked.js等库
   * @param {string} markdown - Markdown文本
   * @returns {string} HTML文本
   */
  export const markdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    // 替换标题
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    
    // 替换粗体和斜体
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>');
    
    // 替换链接
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // 替换列表
    html = html
      .replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>')
      .replace(/^\- (.*$)/gm, '<ul><li>$1</li></ul>')
      .replace(/^\+ (.*$)/gm, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gm, '<ol><li>$1</li></ol>');
    
    // 修复列表标签
    html = html
      .replace(/<\/ul><ul>/g, '')
      .replace(/<\/ol><ol>/g, '');
    
    // 替换分隔线
    html = html.replace(/^\-\-\-$/gm, '<hr>');
    
    // 替换段落
    html = html.replace(/^([^<].*?)$/gm, '<p>$1</p>');
    
    // 替换换行符
    html = html.replace(/\n$/gm, '');
    
    return html;
  };
  
  /**
   * 将文本中的URL转换为可点击的链接
   * @param {string} text - 原始文本
   * @returns {string} 包含链接的HTML字符串
   */
  export const linkifyText = (text) => {
    if (!text) return '';
    
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  };
  
  /**
   * 获取字符串的字符数（考虑中文字符）
   * @param {string} str - 原始字符串
   * @returns {number} 字符数
   */
  export const getCharCount = (str) => {
    if (!str) return 0;
    
    // 将中文字符视为一个字符
    return str.replace(/[\u4e00-\u9fa5]/g, '*').length;
  };