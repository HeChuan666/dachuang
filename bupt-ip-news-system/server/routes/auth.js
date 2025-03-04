const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// 注册用户
router.post(
  '/register',
  [
    check('username', '用户名是必填项').not().isEmpty(),
    check('email', '请包含有效的电子邮件').isEmail(),
    check('password', '请输入6个或更多字符的密码').isLength({ min: 6 })
  ],
  authController.register
);

// 用户登录
router.post(
  '/login',
  [
    check('email', '请包含有效的电子邮件').isEmail(),
    check('password', '密码是必填项').exists()
  ],
  authController.login
);

// 获取当前用户信息
router.get('/me', protect, authController.getMe);

// 更新用户资料
router.put('/profile', protect, authController.updateProfile);

// 更新密码
router.put(
  '/password',
  [
    protect,
    check('currentPassword', '当前密码是必填项').exists(),
    check('newPassword', '请输入6个或更多字符的密码').isLength({ min: 6 })
  ],
  authController.updatePassword
);

module.exports = router;