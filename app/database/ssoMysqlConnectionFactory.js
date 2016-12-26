var mysql = require('mysql');
var config = require('../../config/m2m-config')();

function createDBConnection(){
  return mysql.createConnection({
    host:config.mysql.host,
    user:config.mysql.username,
    password:config.mysql.password,
    database:config.databases.sso
  });
}

module.exports = function(){
  return createDBConnection;
}
