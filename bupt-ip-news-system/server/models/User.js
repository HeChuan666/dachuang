const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户模型架构
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '请提供用户名'],
    unique: true,
    trim: true,
    maxlength: [50, '用户名不能超过50个字符']
  },
  email: {
    type: String,
    required: [true, '请提供邮箱'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '请提供有效的邮箱'
    ]
  },
  password: {
    type: String,
    required: [true, '请提供密码'],
    minlength: 6,
    select: false
  },
  nickname: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  favoriteNews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News'
  }]
});

// 密码加密
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 签发JWT令牌
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username, role: this.role },
    process.env.JWT_SECRET || 'bupt_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// 验证用户密码
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);