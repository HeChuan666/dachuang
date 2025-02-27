// 导入数据库操作模块
const connectDB = require('../db/index');
//导入加密模块
const bcrypt = require('bcryptjs');
// 导入 jsonwebtoken 模块
const jwt = require('jsonwebtoken');
// 导入配置文件
const config = require('../config');

// 注册用户的处理函数
exports.regUser = async (req, res) => {
  const userinfo = req.body;
  console.log(userinfo);

  if (!userinfo.username || !userinfo.password) {
    return res.cc('用户名或密码不能为空！')
  }

  try {
    // 获取数据库连接
    const { users } = await connectDB();

    // 检查用户名是否已存在
    const user = await users.findOne({ username: userinfo.username });

    if (user) {

      return res.cc('用户名已被占用，请更换其他用户名！');
    }

    // 对密码进行哈希处理

    const hashedPassword = await bcrypt.hash(userinfo.password, 10); // 10 是计算成本因子

    // 创建新的用户对象并保存到数据库
    const newUser = {
      username: userinfo.username,
      password: hashedPassword, // 使用哈希后的密码
      email: userinfo.email,    // 假设你也想保存邮箱
      user_pic: userinfo.user_pic // 假设你也想保存用户头像链接
    };

    const result = await users.insertOne(newUser);

    if (!result || !result.insertedId) {
      throw new Error("插入新用户失败");
    }

    // 获取插入的用户 ID
    const userId = result.insertedId;

    res.send({ status: 0, message: '注册成功！', userId: userId.toString() });

  } catch (err) {
    console.error('Error during registration', err);
    res.send({ status: 1, message: err.message });
  }
};

// 登录的处理函数
exports.login = async (req, res) => {
  const userinfo = req.body;
  // 检查用户名和密码是否为空
  if (!userinfo.username || !userinfo.password) {
    return res.send({ status: 1, message: '用户名或密码不能为空！' });
  }

  try {
    // 获取数据库连接
    const { users } = await connectDB();

    // 查询用户
    const user = await users.findOne({ username: userinfo.username });

    // 检查用户是否存在
    if (!user) {
      return res.cc('登录失败，该用户不存在！');
    }

    // 验证密码
    const isPasswordValid = bcrypt.compareSync(userinfo.password, user.password);
    if (!isPasswordValid) {
      return res.cc('登录失败，用户名与密码不匹配！');
    }

    // 登录成功
    // 剔除密码和其他隐私信息
    const userWithoutSensitiveInfo = {
      id: user._id,
      username: user.username,
      email: user.email,    // 假设你想返回邮箱
    };

    // 生成 Token 字符串
    const tokenStr = jwt.sign(userWithoutSensitiveInfo, config.jwtSecretKey, {
      expiresIn: '10h', // token 有效期为 10 个小时
    });

    console.log('Generated Token:', tokenStr); // 打印生成的 Token

    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
    });
  } catch (err) {
    console.error('Error during login', err);
    res.send({ status: 1, message: '登录失败，请稍后再试！' });
  }

};