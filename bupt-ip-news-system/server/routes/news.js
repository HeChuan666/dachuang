const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  searchNews,
  addComment,
  likeNews,
  favoriteNews
} = require('../controllers/news');
const { protect, authorize } = require('../middleware/auth');

// 获取所有新闻
router.get('/', getNews);

// 搜索新闻
router.get('/search', searchNews);

// 获取单个新闻
router.get('/:id', getNewsById);

// 创建新闻 (仅管理员)
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    check('title', '标题是必填项').not().isEmpty(),
    check('content', '内容是必填项').not().isEmpty(),
    check('summary', '摘要是必填项').not().isEmpty(),
    check('category', '分类是必填项').not().isEmpty(),
    check('tags', '标签是必填项').isArray().not().isEmpty()
  ],
  createNews
);

// 更新新闻 (仅管理员)
router.put(
  '/:id',
  [
    protect,
    authorize('admin')
  ],
  updateNews
);

// 删除新闻 (仅管理员)
router.delete(
  '/:id',
  [
    protect,
    authorize('admin')
  ],
  deleteNews
);

// 添加评论
router.post(
  '/:id/comments',
  [
    protect,
    check('text', '评论内容是必填项').not().isEmpty()
  ],
  addComment
);

// 点赞新闻
router.put('/:id/like', protect, likeNews);

// 收藏新闻
router.put('/:id/favorite', protect, favoriteNews);

module.exports = router;