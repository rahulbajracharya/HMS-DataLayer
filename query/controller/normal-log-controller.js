var normalLogBl = require('../business/normal-log-bl');
var httpLogController = require('../controller/http-log-controller');

//get Normal Log
exports.normalLogGet = function (req, res) {
     httpLogController.postHttpLog(req,0); //api request log
    normalLogBl.normalLog(req, function (result) {
        if (req.query.count && req.query.count == "true") {
            normalLogBl.normalLogTotalCount(function (count) {
                res.status(200).send({ 'status': '200', 'data': result, 'count': count });
            });
        }
        else {
            res.status(200).send({ 'status': '200', 'data': result });
        }
        console.log("GET /api/normal-log: Normal Log requested.");
        httpLogController.postHttpLog(req,1); //api request success log
    });

}

//export function for advance-search
exports.getAdvanceSearch = function (req, res) {
    httpLogController.postHttpLog(req,0); //api request log
    normalLogBl.normalLogAdvanceSearch(req, function (result) {
        if (req.query.count && req.query.count == "true") {
            normalLogBl.normalLogTotalCount(function (count) {
                res.status(200).send({ 'status': '200', 'data': result, 'count': count });
            });
        }
        else {
            res.status(200).send({ 'status': '200', 'data': result });
        }
        httpLogController.postHttpLog(req,1); //api request success log
        console.log("GET /api/normal-log-advance-search")
    });
}

//export function for log aggregate
exports.getLogTypeAggregate = function (req, res) {
    httpLogController.postHttpLog(req,0);
    normalLogBl.getLogTypeCount(req, function (result) {
        res.status(200).send({ 'status': '200', 'data': result });
        httpLogController.postHttpLog(req,1);
        console.log("GET /api/normallog/logaggregate: Normal Log Aggregate for different status type Requested");
    });
    
}
