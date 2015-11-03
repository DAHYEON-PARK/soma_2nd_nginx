var g_token = '';
var user_id = '';
var user_pw = '';

var userJson;

function setToken(token) {
      g_token = token;
}

function setUserId(id){
      user_id = id;
}

function setUserPW(pw){
      user_pw = pw;
}

function getToken() {
      return g_token;
}

function getUserId(){
      return user_id;
}

function getUserPW(){
      return user_pw;
}

function setUserInfoFromJson(token, id, pw) {
      
      g_token = token;
      user_id = id;
      user_pw = pw;
                  
      var userInfo = {
        "\"token\"":String(g_token),
        "\"id\"":String(user_id),
        "\"pw\"":String(user_pw)
      };
                                                             
      $.ajax({
          type: 'POST',
          url: 'js/menu.json',
          data: userInfo,
	      dataType: 'json',
          success: function(data, status) {
            console.log(data);
          },
          error: function(e) {
            console.log('접속이 원활하지 않습니다.');
          }
      });   
}

function getUserInfoFromJson(func) {
      
    $.ajax({
        type: 'GET',
        url: 'js/user.json',
        success: function(data, status) {
          userJson = parseJson(data);
          
          if(userJson.length == 0)
            return;
          
          g_token = userJson.token;
          user_id = userJson.id;
          user_pw = userJson.pw;
 
	      func(user_id);          
        },
        error: function(e) {
          console.log('접속이 원활하지 않습니다.');
        }
    });   
}
