
var normalLog = require('../models/normal-log-model');
var common = require('../core/common');
var mongoPaging = require('mongo-cursor-pagination');
var queryBuilder = require('../core/query-mapper');
var commondb = require("../da/da-common");
var dbconfig = require("../core/dbconf");
var collection = "normallogs";

module.exports.getNormalLog = function (req, callback) {
    var query = getLogQuery(req);
    var queryReq = commondb.getQueryReq(req);
    commondb.executeQuery(query, queryReq, collection, function (result) {
        return callback(result);
    })
}

//advance search result
module.exports.advanceSearchResult = function (req, callback) {
    var condition = JSON.parse(req.query.condition);
    queryBuilder.queryMapper(condition.data, function (query) {
        console.log(query);
        var queryReq = commondb.getQueryReq(req);
        commondb.executeQuery(query, queryReq, collection, function (data) {
            return callback(data);
        })
    });
}

//query generation for detail log
function getLogQuery(reqs) {
    var query = {};

    if (reqs.query.user_id) {
        query1 = { "user_id": reqs.query.user_id };
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.limit) {
        limit = parseInt(reqs.query.limit);
    }
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
    if (reqs.query.log_id) {
        var logid = new objectId(reqs.query.log_id);
        query1 = { "_id": logid };
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.trans_id) {
        query1 = { "trans_id": reqs.query.trans_id };
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.trans_health_type) {
        var trans_health_type = parseInt(reqs.query.trans_health_type);
        query1 = { "trans_health_type": trans_health_type }
        query = Object.assign({}, query, query1);
    }
    if (reqs.query.status) {
        var status = parseInt(reqs.query.status);
        query1 = { "status": status };
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
    return query;
}

/*Original
module.exports.logTypeCount =function (start, end, callback)
{
    var normlog = normalLog;
    normalLog.aggregate( [ { $match: { "timestamp" : {$gte: start, $lte: end}}}, { $group : { _id : "$meta.details.trans_id", count:{$sum : 1} } } ] ).toArray(function(err,result){
     if(err) throw err;
     return callback(result);
 });*/

//test

module.exports.logTypeCount = function (time, callback) {
    var db = dbconfig.db();
    var normlog = normalLog;
    db.collection(collection).aggregate([{ $match: { "timestamp": { $gte: time.start, $lte: time.end } } }, {
        $group:
            { _id: "$status", count: { $sum: 1 } }
    }]).toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        var final = getSummaryFormat(result);
        // console.log(final);
        return callback(final);
    });
}

//for strict formating of status type.
function getSummaryFormat(result) {
    var obje = [{ _id: 2, count: 0 }
        , { _id: 3, count: 0 }
        , { _id: 4, count: 0 }
        , { _id: 5, count: 0 }
        , { _id: 6, count: 0 }
        , { _id: 7, count: 0 }
    ]
    //todo-refactor
    return common.mergeObj(obje, result);
}
module.exports.totalNormalLogCount = function (callback) {
    commondb.getCount(collection, function (result) {
        return callback(result);
    });
}

module.exports.logAggNormCount = function (time, callback) {
    var db = dbconfig.db();
    var normlog = normalLog;
    db.collection(collection).find({ $and: [{ $or: [{ "status": 5 }, { "status": 6 }] }, { timestamp: { $gte: time.start, $lte: time.end } }] }).count(function (err, result) {
        if (err) throw err;
        return callback(result);
    });

}
