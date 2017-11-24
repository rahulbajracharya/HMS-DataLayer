var common = require("../core/common");
var commondb = require("../da/da-common");
var queryBuilder = require("../core/query-mapper");
var dbconfig = require("../core/dbconf");
var request = require('request');
var collection = "httplogs";
var postapi = "http";

//httplog detail
module.exports.getHttpLogs = function (req, callback) {
    var query = getHttpLogQuery(req);
    var queryReq = commondb.getQueryReq(req);
    var count = "false";
    if(req.query.count && req.query.count == "true")
    {
        count = req.query.count;
    }
    commondb.executeQuery(query, queryReq, collection,count, function (result) {
        return callback(result);
    });
}
//httplog advancesearch
module.exports.advanceSearchResult = function (req, callback) {
    if (req.query.condition) {
        var condition = JSON.parse(req.query.condition);
        queryBuilder.queryMapper(condition.data, function (query) {
            //console.log(query);
            var queryReq = commondb.getQueryReq(req);
            var count = "false";
            if(req.query.count && req.query.count == "true")
            {
                count = req.query.count;
            }
            commondb.executeQuery(query, queryReq, collection,count, function (data) {
                return callback(data);
            });
        });
    }
    else {
        return callback("");
    }
}
//httplog count.
module.exports.totalHttpLogCount = function (callback) {
    commondb.getCount(collection, function (result) {
        return callback(result);
    })
}

module.exports.logAggHttpCount = function (time, callback) {
    var db = dbconfig.db();
    //console.log(time.start + time.end)
    db.collection(collection).find({ timestamp: { $gte: time.start, $lte: time.end } }).count(function (err, result) {
        if (err) throw err;
        return callback(result);
    });
}

//aggreate httplog by service type
module.exports.httpLogAggr = function (time, callback) {
    var db = dbconfig.db();
    db.collection(collection).aggregate([{ $match: { "timestamp": { $gte: time.start, $lte: time.end } } }, {
        $group:{ _id: "$service_type", count: { $sum: 1 } }
    }]).toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        var final = getSummaryFormat(result);
        // console.log(final);
        return callback(final);
    });
}

//Http log write request
module.exports.httpPostRequest = function (model, callback) {
    request.post({
        "headers": dbconfig.postConfig.headers ,
        "url": dbconfig.postConfig.url +"/"+postapi,
        "body": JSON.stringify({
            "data": model
        })
    }, (error, response, body) => {
        if (error) {
            return console.log(error);
        }
    });
}



//for strict formating of status type.
function getSummaryFormat(result) {
    var obje = [{ _id: 4, count: 0 }
        , { _id: 3, count: 0 }
        , { _id: 2, count: 0 }
    ]
    //todo-refactor
    return common.mergeObj(obje, result);
}


//query generation for Http detail log
function getHttpLogQuery(reqs) {
    var query = {};
    //query for timestamp range
    if (reqs.query.start_date && reqs.query.end_date) {
        start_date = common.convertToISO(reqs.query.start_date).toISOString();
        end_date = common.convertToISO(reqs.query.end_date).toISOString();
        query1 = { timestamp: { $gte: start_date, $lte: end_date } };
        query = Object.assign({}, query, query1);
    }
    else if (reqs.query.start_date) {
        start_date = common.convertToISO(reqs.query.start_date).toISOString();
        query1 = { timestamp: { $gte: start_date } };
        query = Object.assign({}, query, query1);
    }
    else if (reqs.query.end_date) {
        end_date = common.convertToISO(reqs.query.end_date).toISOString();
        query1 = { timestamp: { $lte: end_date } };
        query = Object.assign({}, query, query1);
    }
    else {
        var date = new Date();
        start_date = date;
        end_date = common.convertToISO(date).toISOString();
        start_date.setDate(start_date.getDate() - 30);
        start_date = common.convertToISO(start_date).toISOString();
        query1 = { timestamp: { $gte: start_date, $lte: end_date } };
        query = Object.assign({}, query, query1);
    }
    ///
    if (reqs.query.trans_id) {
        query1 = { "trans_id": reqs.query.trans_id };
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.trans_health_type) {
        var trans_health_type = parseInt(reqs.query.trans_health_type);
        query1 = { "trans_health_type": trans_health_type }
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.device_type) {
        query1 = { "device_type": reqs.query.device_type }
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.service_type) {
        query1 = { "service_type": reqs.query.service_type }
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.system_type) {
        system_type = parseInt(reqs.query.system_type);
        query1 = { "system_type": system_type }
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.instance_type) {
        query1 = { "instance_type": req.query.instance_type };
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.http_verb) {
        query1 = { "http_verb": req.query.http_verb };
        query = Object.assign({}, query, query1);
    }
    return query;
}

