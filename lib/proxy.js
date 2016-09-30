var IDMHttpClient = require('agile-idm-client').http;
var http = require('http');
var httpProxy = require('http-proxy');
var Pdp = require('./pdp');


var server = function(conf){

  var idmHttpClient = new IDMHttpClient(conf);
  var proxy = httpProxy.createProxyServer({});
  var target = conf["proxy"]["target"];
  var pdp = new Pdp(conf);

  proxy.on('error', function(e) {
    console.log('something went wrong '+e);
  });

  var handleError = function(err, res){
    console.log('handling error');
    res.statusCode = 401;
    var info = "'hi: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2)"
    if(err){
      info = err.toString();
      //later check which kind of error is happening here?
    }
    res.write(info);
    res.end();
  }

  var handleUnauthorized = function(err, res){
    console.log('handling unauthorized');
    res.statusCode = 403;
    var info = "'hi: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2)"
    if(err){
      info = err.toString();
      //later check which kind of error is happening here?
    }
    res.write(info);
    res.end();
  }

  var authenticateRequest = function(req, res){

      if(req.headers.hasOwnProperty("authorization")){
         var auth = idmHttpClient.authenticateEntityPromisse(req.headers["authorization"].replace("bearer","").replace("Bearer","").trim());
         auth.then(function(data){
             console.log('user authenticated '+ data["user_id"] + " auth_type " + data["auth_type"])
             pdp.evaluatePolicyPromisse (data, req,res).then(function(result){
               //we reach this only if the pdp lets us.
               console.log('pdp ok:'+req+res );
               proxy.web(req, res, {
                  target: target
               });

             }).catch(function(err){
                handleUnauthorized(err, res);
             });
             return;
         }).catch(function(error){
              handleError(error, res);
          });
        return;
      }
      else{
        return handleError(res);
      }
  }
  //process the request
  var server = http.createServer(function(req, res) {
        authenticateRequest(req, res);
  });
  return server;

}
module.exports = server;
