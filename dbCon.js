var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit	: 10,
	host			: 'classmysql.engr.oregonstate.edu',
	user			: 'cs361_deleonp',
	password		: 'cs361W!*',
	database		: 'cs361_deleonp'
});
module.exports.pool = pool;
