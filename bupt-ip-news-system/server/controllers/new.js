const News = require('../models/News');
const { validationResult } = require('express-validator');

// @desc    获取所有新闻
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
  try {
    // 实现分页功能
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // 实现过滤功能
    let query = {};
    
    // 按分类过滤
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // 按标签过滤
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // 执行查询
    const news = await News.find(query)
      .populate('author', 'username nickname avatar')
      .skip(startIndex)
      .limit(limit)
      .sort({ publishDate: -1 });
    
    // 获取总文档数
    const total = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: news
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    获取单个新闻
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'username nickname avatar');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: '未找到新闻'
      });
    }

    // 增加浏览量
    news.views += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (err) {
    console.error(err.message);
    
    // 检查是否是无效ID错误
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: '未找到新闻'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    创建新闻
// @route   POST /api/news
// @access  Private (Admin)
exports.createNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    // 创建新闻
    const news = await News.create({
      ...req.body,
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      data: news
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    更新新闻
// @route   PUT /api/news/:id
// @access  Private (Admin)
exports.updateNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: '未找到新闻'
      });
    }

    // 更新新闻
    news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    删除新闻
// @route   DELETE /api/news/:id
// @access  Private (Admin)
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: '未找到新闻'
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: '新闻已删除'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    搜索新闻
// @route   GET /api/news/search
// @access  Public
exports.searchNews = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: '请提供搜索关键词'
      });
    }

    // 使用MongoDB的全文搜索
    const news = await News.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .populate('author', 'username nickname avatar');

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    添加评论
// @route   POST /api/news/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: '未找到新闻'
      });
    }

    const newComment = {
      text: req.body.text,
      user: req.user.id,
      name: req.user.username || req.user.nickname
    };

    // 添加评论到数组开头
    news.comments.unshift(newComment);

    await news.save();

    res.status(201).json({
      success: true,
      data: news.comments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    点赞新闻
// @route   PUT /api/news/:id/like
// @access  Private
exports.likeNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: '未找到新闻'
      });
    }

    // 增加点赞数
    news.likes += 1;
    await news.save();

    res.status(200).json({
      success: true,
      likes: news.likes
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    添加到收藏
// @route   PUT /api/news/:id/favorite
// @access  Private
exports.favoriteNews = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newsId = req.params.id;

    // 检查新闻是否存在
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: '未找到新闻'
      });
    }

    // 检查是否已经收藏
    if (user.favoriteNews.includes(newsId)) {
      // 取消收藏
      user.favoriteNews = user.favoriteNews.filter(id => id.toString() !== newsId);
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: '已从收藏中移除',
        isFavorite: false
      });
    }

    // 添加到收藏
    user.favoriteNews.push(newsId);
    await user.save();

    res.status(200).json({
      success: true,
      message: '已添加到收藏',
      isFavorite: true
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};