/**
 * 
 * @param {*} success 数据库连接成功的回调
 * @param {*} error 数据库连接失败的回调
 */
const log4j = require('../utils/log4j.js')
const { startCron } = require('../crontask/index.js')
module.exports = function (success, error) {
  //判断 error 为其设置默认值
  if (typeof error !== 'function') {
    error = () => {
      console.log('连接失败~~~');
    }
  }
  //1. 安装 mongoose
  //2. 导入 mongoose
  const mongoose = require('mongoose');
  //导入 配置文件
  const { DB_HOST, DB_PORT, DB_NAME } = process.env;
  //设置 strictQuery 为 true
  mongoose.set('strictQuery', true);

  //3. 连接 mongodb 服务                        数据库的名称
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

  //4. 设置回调
  // 设置连接成功的回调  once 一次   事件回调函数只执行一次
  mongoose.connection.once('open', () => {
    success();
    startCron()
    log4j.info('连接数据库成功！')
  });

  // 设置连接错误的回调
  mongoose.connection.on('error', () => {
    error();
  });

  //设置连接关闭的回调
  mongoose.connection.on('close', () => {
    console.log('连接关闭');
  });
}