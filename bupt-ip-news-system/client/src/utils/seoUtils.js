/**
 * 动态更新页面标题
 * @param {string} title - 页面标题
 * @param {string} [siteName] - 网站名称
 */
export const updatePageTitle = (title, siteName = '北京邮电大学知识产权资讯') => {
    document.title = title ? `${title} - ${siteName}` : siteName;
  };
  
  /**
   * 更新页面的元标签
   * @param {object} meta - 元标签对象
   * @param {string} [meta.description] - 页面描述
   * @param {string} [meta.keywords] - 页面关键词
   * @param {string} [meta.author] - 页面作者
   * @param {string} [meta.ogTitle] - Open Graph 标题
   * @param {string} [meta.ogDescription] - Open Graph 描述
   * @param {string} [meta.ogImage] - Open Graph 图片
   */
  export const updateMetaTags = (meta = {}) => {
    // 设置描述
    if (meta.description) {
      let descriptionTag = document.querySelector('meta[name="description"]');
      if (!descriptionTag) {
        descriptionTag = document.createElement('meta');
        descriptionTag.setAttribute('name', 'description');
        document.head.appendChild(descriptionTag);
      }
      descriptionTag.setAttribute('content', meta.description);
    }
    
    // 设置关键词
    if (meta.keywords) {
      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement('meta');
        keywordsTag.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute('content', meta.keywords);
    }
    
    // 设置作者
    if (meta.author) {
      let authorTag = document.querySelector('meta[name="author"]');
      if (!authorTag) {
        authorTag = document.createElement('meta');
        authorTag.setAttribute('name', 'author');
        document.head.appendChild(authorTag);
      }
      authorTag.setAttribute('content', meta.author);
    }
    
    // 设置Open Graph标签
    if (meta.ogTitle) {
      let ogTitleTag = document.querySelector('meta[property="og:title"]');
      if (!ogTitleTag) {
        ogTitleTag = document.createElement('meta');
        ogTitleTag.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitleTag);
      }
      ogTitleTag.setAttribute('content', meta.ogTitle);
    }
    
    if (meta.ogDescription) {
      let ogDescTag = document.querySelector('meta[property="og:description"]');
      if (!ogDescTag) {
        ogDescTag = document.createElement('meta');
        ogDescTag.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescTag);
      }
      ogDescTag.setAttribute('content', meta.ogDescription);
    }
    
    if (meta.ogImage) {
      let ogImageTag = document.querySelector('meta[property="og:image"]');
      if (!ogImageTag) {
        ogImageTag = document.createElement('meta');
        ogImageTag.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageTag);
      }
      ogImageTag.setAttribute('content', meta.ogImage);
    }
  };
  
  /**
   * 为页面添加结构化数据标记（JSON-LD）
   * @param {object} schema - 结构化数据对象
   */
  export const addStructuredData = (schema) => {
    if (!schema) return;
    
    // 移除现有的JSON-LD脚本
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // 创建新的JSON-LD脚本
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  };
  
  /**
   * 为新闻文章生成结构化数据
   * @param {object} article - 文章数据
   * @returns {object} 结构化数据对象
   */
  export const generateArticleSchema = (article) => {
    if (!article) return null;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'description': article.summary,
      'image': article.coverImage ? `${window.location.origin}/images/covers/${article.coverImage}` : undefined,
      'datePublished': article.publishDate,
      'dateModified': article.updatedAt || article.publishDate,
      'author': {
        '@type': 'Person',
        'name': article.author?.nickname || article.author?.username || '知识产权资讯编辑'
      },
      'publisher': {
        '@type': 'Organization',
        'name': '北京邮电大学知识产权资讯',
        'logo': {
          '@type': 'ImageObject',
          'url': `${window.location.origin}/images/logo.png`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': window.location.href
      }
    };
  };
  
  /**
   * 生成面包屑导航的结构化数据
   * @param {Array} items - 面包屑项数组，每项包含name和url
   * @returns {object} 结构化数据对象
   */
  export const generateBreadcrumbSchema = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }));
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': itemListElement
    };
  };