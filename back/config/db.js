const mysql = require('mysql')

const db = mysql.createConnection({
    host : "gilyounggood01.cljw0vruuaex.ap-northeast-2.rds.amazonaws.com",
    user : 'admin',
    password : 'rlf123789-',
    port : 3306,
    database:'login_lecture',
    timezone: 'Asia/Seoul'
})
db.connect();

module.exports = db;