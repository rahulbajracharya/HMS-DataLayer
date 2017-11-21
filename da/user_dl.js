var dbconfig = require("../core/dbconf");
var collection = "users";

module.exports.checkUser = function (username, password, callback) {
    var db = dbconfig.db();
    db.collection(collection).findOne({ user_name: username }, function (err, user) {
        if (err) console.log(err);
        if (!user) {
            return callback("User not found");
        }
        db.collection(collection).findOne({ user_name: username, password: password }, function (err, user) {
            if (err) console.log(err);
            if (!user) { return callback("Password incorrect"); }
            return callback("User valid");
        });
    });
}