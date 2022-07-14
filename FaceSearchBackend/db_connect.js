mysql = require('mysql');

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'celeba',
	port: 3306
});

module.exports = db;