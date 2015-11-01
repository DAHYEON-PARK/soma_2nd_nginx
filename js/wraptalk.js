var g_token = '';
var user_id = '';
var user_pw = '';

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

