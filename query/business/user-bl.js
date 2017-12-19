var userDl = require("../da/user_dl");
var base64 = require('base-64');

var validateUser = function (req, callback) {
    var authorizaton = base64.decode(req.headers.authorization);
    var data = authorizaton.split(":");
    var username = data[0];
    var password = data[1]
    userDl.checkUser(username, password, function (data) {
        return callback(checkForStatus(data));
    })
}
checkForStatus = function (data) {
    var status;
    if (data.message != "User valid") {
        status = 403;
    } else {
        status = 200;
    }
    var result = {
        'status': status,
        'message': data.message,
        'data' : data
    }
    return result;
}
//export functions
module.exports = {
    validateUser: validateUser
}
