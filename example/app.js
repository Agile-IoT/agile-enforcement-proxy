
var conf = {};
var conf = require('./conf/agile-enforcement-proxy-conf');
var server = require('../index')(conf);



 //var idmH = new IDMHttpClient(conf);
//
// Create a proxy server with custom application logic
//

server.listen(8080);
