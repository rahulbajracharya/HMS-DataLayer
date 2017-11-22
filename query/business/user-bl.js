var userDl = require("../da/user_dl");

var validateUser = function (req, callback) {
    var username = req.body.data.username;
    var password = req.body.data.password;
    userDl.checkUser(username, password, function (data) {
        return callback(checkForStatus(data));
    })
}
checkForStatus = function (data) {
    var status;
    if (data != "User valid") {
        status = 403;
    } else {
        status = 200;
    }
    var result = {
        'status': status,
        'data': data
    }
    return result;
}

//export functions
module.exports = {
    validateUser: validateUser
}
