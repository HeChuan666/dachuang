// 导入数据库操作模块
const connectDB = require('../db/index');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs'); // 使用 bcryptjs
const jwt = require('jsonwebtoken');
const config = require('../config');


// 获取用户基本信息的处理函数
exports.getUserInfo = async (req, res) => {
  console.log('Request user:', req.user); // 添加这行来打印 req.user
  try {
    // 获取数据库连接
    const { users } = await connectDB();

    const userId = req.user.id;
    console.log('User ID:', userId); // 添加这行来打印 userId

    // 根据用户的 id 查询用户信息
    const user = await users.findOne(
      { _id: new ObjectId(userId) }, // 查询条件
      { projection: { password: 0 } } // 排除 password 字段
    );

    // 检查用户是否存在
    if (!user) {
      return res.cc('获取用户信息失败！');
    }

    // 返回用户信息
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: user,
    });
  } catch (err) {
    console.error('Error fetching user info', err);
    res.cc('获取用户信息失败！');
  }
};

// 更新用户基本信息的处理函数
exports.updateUserInfo = async (req, res) => {
  const userInfo = req.body;

  // 检查是否有要更新的信息
  if (Object.keys(userInfo).length === 0) {
    console.log('No user info provided in the request body');
    return res.cc('没有提供要更新的信息！');
  }

  // 删除 id 字段，防止更新 _id
  if (userInfo.id) {
    console.log('Deleting id field from update info');
    delete userInfo.id;
  }

  try {
    console.log('Attempting to connect to the database...');
    // 获取数据库连接
    const { users } = await connectDB();
    console.log('Successfully connected to the database');

    const userId = req.user.id;
    console.log('User ID for update:', userId); // 添加这行来打印 userId

    // 确保 userId 是 ObjectId 类型
    const userIdObj = new ObjectId(userId);
    console.log('User ID as ObjectId:', userIdObj); // 添加这行来打印 ObjectId

    // 根据用户的 id 查询用户信息以验证用户是否存在
    const user = await users.findOne({ _id: userIdObj });
    if (!user) {
      console.log('User not found with id:', userIdObj);
      return res.cc('用户不存在！');
    }

    console.log(`Updating user with id: ${userIdObj} with info:`, userInfo);
    // 根据用户的 id 更新用户信息
    const result = await users.updateOne(
      { _id: userIdObj }, // 查询条件
      { $set: userInfo }    // 更新操作
    );
    console.log('Update result:', result);

    // 检查更新是否成功
    if (result.matchedCount === 0) {
      console.log('No user matched the update criteria');
      return res.cc('修改用户基本信息失败！');
    }

    // 修改用户信息成功
    console.log('User info updated successfully');
    return res.cc('修改用户基本信息成功！', 0);

  } catch (err) {
    console.error('Error updating user info', err);
    res.cc('修改用户基本信息失败！');
  }
};

// 重置密码的处理函数
exports.updatePassword = async (req, res) => {
  // 打印 req.body 内容
  console.log('Request body:', req.body);

  const oldPassword = req.body.oldPwd;
  const newPassword = req.body.newPwd;

  // 检查是否有必要的信息
  if (!oldPassword || !newPassword) {
    return res.cc('请提供用户名、旧密码和新密码！');
  }

  try {
    console.log('Attempting to connect to the database...');
    // 获取数据库连接
    const { users } = await connectDB();
    console.log('Successfully connected to the database');

    console.log('User ', req.user);
    //根据解析出的用户id查询用户信息
    const userId = req.user.id;
    console.log('User ID:', userId); // 添加这行来打印 userId

    // 根据用户的 id 查询用户信息
    const user = await users.findOne(
      { _id: new ObjectId(userId) }, // 查询条件
      { projection: { password: 1, _id: 0 } } // 获取 password 字段
    );

    // 检查用户是否存在
    if (!user || !user.password) {
      return res.cc('用户不存在或密码信息缺失');
    }

    // 验证旧密码是否正确
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      console.log('Old password is incorrect');
      return res.cc('旧密码不正确！');
    }

    // 确保新密码与旧密码不一致
    if (oldPassword === newPassword) {
      console.log('New password is the same as the old password');
      return res.cc('新密码不能与旧密码相同！');
    }

    // 使用 bcryptjs 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新用户密码
    const result = await users.updateOne(
      { _id: user._id }, // 查询条件
      { $set: { password: hashedNewPassword } } // 更新操作
    );
    console.log('Update result:', result);

    // 检查更新是否成功
    if (result.matchedCount === 0) {
      console.log('No user matched the update criteria');
      return res.cc('修改密码失败！');
    }

    // 修改密码成功
    console.log('Password updated successfully');
    return res.cc('修改密码成功！', 0);

  } catch (err) {
    console.error('Error updating user password', err);
    res.cc('修改密码失败！');
  }
};