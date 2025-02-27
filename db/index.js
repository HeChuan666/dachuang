const { MongoClient } = require('mongodb');

async function connectDB() {
  const uri = 'mongodb://127.0.0.1:27017'; // MongoDB 连接 URI
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('my_db_01'); //数据库名称
    const users = db.collection('users'); // 集合名称

    return { users }; // 返回集合对象
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    throw err;
  }
}

module.exports = connectDB;