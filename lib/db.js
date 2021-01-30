let mysql = require('sync-mysql');
let db = new mysql({
  host    : 'localhost',
  user    : 'root',
  password: 'zxcvZXCV',
  database: 'archive',
  charset : 'utf8mb4'
});

module.exports = db;
