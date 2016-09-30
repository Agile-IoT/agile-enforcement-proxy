module.exports = {
  "authentication":{
    "web-server":"http://127.0.0.1:3000/api/"
  },
  "proxy":{
    "target": "http://127.0.0.1:1880" 
  },
  "users":[
           {"auth_type":"fallback_user_no_pam", "user_id":"admin"},
           {"auth_type":"github", "user_id":"nopbyte"}
  ]
}
