var httpLogBl = require("../business/http-log-bl");

//get Http Log Detail
exports.httpLogGet = function (req, res)
{
    httpLogBl.httpLogDetails(req,function(result){
        res.status(200).send({'status':'200','data': result});
    })
  console.log("GET /api/normal-log: Normal Log requested.");
}