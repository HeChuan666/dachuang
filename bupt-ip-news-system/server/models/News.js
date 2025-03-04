const mongoose = require('mongoose');

// 新闻模型架构
const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请提供新闻标题'],
    trim: true,
    maxlength: [200, '标题不能超过200个字符']
  },
  content: {
    type: String,
    required: [true, '请提供新闻内容']
  },
  summary: {
    type: String,
    required: [true, '请提供新闻摘要'],
    maxlength: [500, '摘要不能超过500个字符']
  },
  coverImage: {
    type: String,
    default: 'default-news.jpg'
  },
  category: {
    type: String,
    required: [true, '请提供新闻分类'],
    enum: [
      '专利法规',
      '商标法规',
      '著作权法规',
      '知识产权保护',
      '专利申请',
      '专利案例',
      '知识产权动态',
      '国际知识产权'
    ]
  },
  tags: {
    type: [String],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      name: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

// 添加全文搜索索引
NewsSchema.index({ title: 'text', content: 'text', summary: 'text', tags: 'text' });

module.exports = mongoose.model('News', NewsSchema);