var dbconfig = require("../core/dbconf");
var collection = "users";

module.exports.checkUser = function (username, password, callback) {
    var db = dbconfig.db();
    var data = {};
    db.collection(collection).findOne({ user_name: username }, function (err, user) {
        if (err) console.log(err);
        if (!user) {
            data = {
                "message": "User not found"
            }
            return callback(data);
        }
        db.collection(collection).findOne({ user_name: username, password: password }, function (err, user) {
            if (err) console.log(err);
            if (!user) {
                data = {
                    "message": "Password incorrect"
                }
                return callback(data);
            }
            data = {
                "username": user.user_name,
                "system_type": user.system_type,
                "message": "User valid"
            }
            return callback(data);
        });
    });
}