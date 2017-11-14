var httpLogdl = require("../da/http-log-dl");


//http log details get
module.exports.httpLogDetails = function (req, callback)
{
    httpLogdl.getHttpLogs(function(result){
        return callback(result);
    });
}