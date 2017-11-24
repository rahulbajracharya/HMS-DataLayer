var httpLogdl = require("../da/http-log-dl");
var httpModel = require("../models/http-log-model");
var common = require("../core/common");
var ObjectID = require('mongodb').ObjectID;
var url = require('url');


//http log details get
httpLogDetails = function (req, callback) {
    httpLogdl.getHttpLogs(req, function (result) {
        return callback(result);
    });
}

//httplog advance search.
httpLogAdvanceSearch = function (req, callback) {
    httpLogdl.advanceSearchResult(req, function (result) {
        return callback(result)
    })
}

//httplog total count
httpLogTotalCount = function (callback) {
    httpLogdl.totalHttpLogCount(function (result) {
        return callback(result);
    })
}

//get httplog summary.
getHttpLogAggr = function (req, callback) {
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
/************************************************************************************************/
/*Http log write business*/
httpLogWriteRequest = function (req, stack, callback) {
    var model = createNewHttpModel(req, stack);
    httpLogdl.httpPostRequest(model, function (data) {
        return callback(model);
    });
}

function createNewHttpModel(req, stack) {
    var a = url.parse(req.headers['host']);
    var date = new Date(); var method;
    date = date.toISOString();
    if (stack == 0) {
        method = req.method;
    } else {
        method = "ack";
    }
    var model = new httpModel({
        header: JSON.stringify(req.headers)
        , url: req.baseUrl + req.route.path
        , http_verb: method
        , trans_id: req.headers['trans_id']
        //health status
        , trans_health_type: req.headers['trans_health_type']
        , parameters: JSON.stringify(req.query)
        , device_type: req.headers['device_type']
        , instance_type: parseInt(a.host)
        // determine which layer: apigateway: 4, queue: 3, databaase : 2
        , service_type: 2
        // determines which system logged logs
        , system_type: req.headers['system_type']
        //logged in user
        , user_id: req.headers['user_id']
        , timestamp: date
    });
    return model;
}


//public export functions
module.exports = {
    getHttpLogAggr: getHttpLogAggr
    , httpLogTotalCount: httpLogTotalCount
    , httpLogAdvanceSearch: httpLogAdvanceSearch
    , httpLogDetails: httpLogDetails
    , httpLogWriteRequest: httpLogWriteRequest
}