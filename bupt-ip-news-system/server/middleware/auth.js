const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { username, email, password } = req.body;

  try {
    // 检查用户是否已存在
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: '用户已存在' 
      });
    }

    // 创建用户
    user = await User.create({
      username,
      email,
      password
    });

    // 创建 token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token
    });
  } catch (err) {
    console.error('注册用户错误:', err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;

  try {
    // 验证邮箱和密码
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '无效的凭据' 
      });
    }

    // 检查密码是否匹配
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: '无效的凭据' 
      });
    }

    // 创建 token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    console.error('用户登录错误:', err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    获取当前用户
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: '未授权访问'
      });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('获取当前用户错误:', err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    更新用户资料
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: '未授权访问'
      });
    }
    
    const { nickname, email } = req.body;
    
    // 构建更新对象
    const updateData = {};
    if (nickname) updateData.nickname = nickname;
    if (email) updateData.email = email;
    
    // 如果没有数据更新，则返回当前用户
    if (Object.keys(updateData).length === 0) {
      const currentUser = await User.findById(req.user.id);
      return res.status(200).json({
        success: true,
        data: currentUser,
        message: '没有提供需要更新的数据'
      });
    }

    // 更新用户
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('更新用户资料错误:', err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    更新密码
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: '未授权访问'
      });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '请提供当前密码和新密码'
      });
    }

    // 获取用户并包含密码字段
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查当前密码
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: '当前密码错误' 
      });
    }

    // 设置新密码
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: '密码更新成功'
    });
  } catch (err) {
    console.error('更新密码错误:', err.message);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};