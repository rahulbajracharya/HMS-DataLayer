var httpLogBl = require("../business/http-log-bl");

//get Http Log Detail
exports.httpLogGet = function (req, res)
{
    httpLogBl.httpLogDetails(req,function(result){
        if(req.query.count && req.query.count=="true")
        {
            httpLogBl.httpLogTotalCount(function(count){
                res.status(200).send({'status':'200','data':result,'count':count});
            });
        }
        else{
        res.status(200).send({'status':'200','data': result});
        }
        console.log("GET /api/http-log: Http Log requested.");
    })
  
}

exports.getAdvanceSearch = function(req,res)
{
    httpLogBl.httpLogAdvanceSearch(req,function(result){
        if(req.query.count && req.query.count=="true")
        {
            httpLogBl.httpLogTotalCount(function(count){
                res.status(200).send({'status':'200','data':result,'count':count});
            });
        }
        else{
        res.status(200).send({'status':'200','data': result});
        }
        console.log("GET /api/http-log-advance-search : Http Log requested.");
    })
    
}