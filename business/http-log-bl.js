var httpLogdl = require("../da/http-log-dl");


//http log details get
module.exports.httpLogDetails = function (req, callback)
{
    httpLogdl.getHttpLogs(function(result){
        return callback(result);
    });
}

//httplog advance search.
module.exports.httpLogAdvanceSearch=function(req,callback)
{
    httpLogdl.advanceSearchResult(function(result){
        return callback(result)
    })
}

module.exports.httpLogTotalCount = function(callback)
{
    httpLogdl.totalHttpLogCount(function(result){
        return callback(result);
    })
}