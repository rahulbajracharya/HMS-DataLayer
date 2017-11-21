var httpLogdl = require("../da/http-log-dl");
var common = require("../core/common");


//http log details get
module.exports.httpLogDetails = function (req, callback) {
    httpLogdl.getHttpLogs(req, function (result) {
        return callback(result);
    });
}

//httplog advance search.
module.exports.httpLogAdvanceSearch = function (req, callback) {
    httpLogdl.advanceSearchResult(req, function (result) {
        return callback(result)
    })
}

module.exports.httpLogTotalCount = function (callback) {
    httpLogdl.totalHttpLogCount(function (result) {
        return callback(result);
    })
}

//get httplog summary.
module.exports.getHttpLogAggr = function (req, callback) {
    var newdata = [];
    var time = common.checkDateRange(req);
    httpLogdl.httpLogAggr(time, function (data) {
        for (i = 0; i < data.length; i++) {
            var data1 = new Object;
            data1.id = data[i]._id;
            data1.type = LogTypeParse(data[i]._id);
            data1.count = data[i].count;
            newdata.push(data1);
        }
        var final = common.changeToDefault(newdata);
        return callback(final);
    });
}

//parse log to default
//mapping to default level type
function LogTypeParse(type) {
    switch (type) {
        case 2: return "Data Layer";
        case 3: return "Queue Layer";
        case 4: return "Api Gateway";
    }
    return "None";
}

///mapping to frontend
