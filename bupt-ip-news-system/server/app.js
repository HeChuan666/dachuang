const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./db');

// 加载环境变量
require('dotenv').config();

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ extended: false }));

// 日志
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 路由定义
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));

// 处理生产环境
if (process.env.NODE_ENV === 'production') {
  // 设置静态文件夹
  app.use(express.static(path.join(__dirname, '../client/build')));

  // 所有未处理的请求返回React应用
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 设置端口并启动服务器
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));