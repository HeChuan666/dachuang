const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 连接MongoDB数据库
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bupt_ip_news', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;