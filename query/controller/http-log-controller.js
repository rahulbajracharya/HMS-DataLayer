var httpLogBl = require("../business/http-log-bl");
var logconfig = require('../core/configs');
//get Http Log Detail
exports.httpLogGet = function (req, res) {
    postHttpLog(req,0);
    httpLogBl.httpLogDetails(req, function (result) {
        if (req.query.count && req.query.count == "true") {
            httpLogBl.httpLogTotalCount(function (count) {
                res.status(200).send({ 'status': '200', 'data': result, 'count': count });
            });
        }
        else {
            res.status(200).send({ 'status': '200', 'data': result });
        }
        console.log("GET /api/http-log: Http Log requested.");
        postHttpLog(req,1);
    })
}

exports.getHttpLogAggregate = function (req, res) {
    postHttpLog(req,0);
    httpLogBl.getHttpLogAggr(req, function (result) {
        res.status(200).send({ 'status': '200', 'data': result });
        console.log("GET /api/http-log-summary: Http Log summary requested.");
        postHttpLog(req,1);
    })
}

exports.getAdvanceSearch = function (req, res) {
    postHttpLog(req,0);
    httpLogBl.httpLogAdvanceSearch(req, function (result) {
        if (req.query.count && req.query.count == "true") {
            httpLogBl.httpLogTotalCount(function (count) {
                res.status(200).send({ 'status': '200', 'data': result, 'count': count });
            });
        }
        else {
            res.status(200).send({ 'status': '200', 'data': result });
        }
        postHttpLog(req,1);
        console.log("GET /api/http-log-advance-search : Http Log requested.");
    })

}


//httpPost
var postHttpLog = function (req, stack) {
    if (logconfig.writeLog.value != "false") {
        httpLogBl.httpLogWriteRequest(req, stack, function (result) {
        });
    }
}

module.exports.postHttpLog = postHttpLog;
