var policies = [];
var pdp = function(conf){
   //each user should have user_id and auth_type...
   //NOTE this format of policy will be deprecated soon... we will find a suitable representation for what is needed in AGILE later.
   policies = conf.users;
}

pdp.prototype.evaluatePolicyPromisse = function (user, req, res){

 var promisse = new Promise(function(resolve, reject) {
    for (var i in policies) {
      if(user["user_id"] == policies[i]["user_id"] && user["auth_type"] ==  policies[i]["auth_type"] ){
        return resolve();
      }
    }
    return reject(new Error("unautorhized user")); //TODO improve... maybe put different errors?

 });
 return promisse;

}

module.exports = pdp;
