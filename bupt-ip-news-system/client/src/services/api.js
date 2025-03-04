import axios from 'axios';

// 默认配置
axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 认证失败，清除本地token
      localStorage.removeItem('token');
      
      // 重定向到登录页面
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 新闻相关API
export const newsApi = {
  // 获取新闻列表
  getNews: async (page = 1, limit = 10, category = '', tag = '') => {
    try {
      let url = `/news?page=${page}&limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (tag) url += `&tag=${tag}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      throw error;
    }
  },
  
  // 获取单个新闻详情
  getNewsById: async (id) => {
    try {
      const response = await axios.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取新闻详情失败:', error);
      throw error;
    }
  },
  
  // 搜索新闻
  searchNews: async (query) => {
    try {
      const response = await axios.get(`/news/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('搜索新闻失败:', error);
      throw error;
    }
  },
  
  // 创建新闻(仅管理员)
  createNews: async (newsData) => {
    try {
      const response = await axios.post('/news', newsData);
      return response.data;
    } catch (error) {
      console.error('创建新闻失败:', error);
      throw error;
    }
  },
  
  // 更新新闻(仅管理员)
  updateNews: async (id, newsData) => {
    try {
      const response = await axios.put(`/news/${id}`, newsData);
      return response.data;
    } catch (error) {
      console.error('更新新闻失败:', error);
      throw error;
    }
  },
  
  // 删除新闻(仅管理员)
  deleteNews: async (id) => {
    try {
      const response = await axios.delete(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除新闻失败:', error);
      throw error;
    }
  },
  
  // 添加评论
  addComment: async (newsId, text) => {
    try {
      const response = await axios.post(`/news/${newsId}/comments`, { text });
      return response.data;
    } catch (error) {
      console.error('添加评论失败:', error);
      throw error;
    }
  },
  
  // 点赞新闻
  likeNews: async (newsId) => {
    try {
      const response = await axios.put(`/news/${newsId}/like`);
      return response.data;
    } catch (error) {
      console.error('点赞新闻失败:', error);
      throw error;
    }
  },
  
  // 收藏/取消收藏新闻
  favoriteNews: async (newsId) => {
    try {
      const response = await axios.put(`/news/${newsId}/favorite`);
      return response.data;
    } catch (error) {
      console.error('收藏/取消收藏新闻失败:', error);
      throw error;
    }
  }
};

// 用户相关API
export const userApi = {
  // 获取当前用户信息
  getProfile: async () => {
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },
  
  // 更新用户资料
  updateProfile: async (userData) => {
    try {
      const response = await axios.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  },
  
  // 更新密码
  updatePassword: async (passwordData) => {
    try {
      const response = await axios.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('更新密码失败:', error);
      throw error;
    }
  }
};