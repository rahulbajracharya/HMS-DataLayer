var normalLogBl = require('../business/normal-log-bl');

//get Normal Log
exports.normalLogGet = function (req,res)
{
    normalLogBl.normalLog(req,function(result){
        if(req.query.count && req.query.count=="true")
        {
            normalLogBl.normalLogTotalCount(function(count){
                res.status(200).send({'status':'200','data':result,'count':count});
            });
        }
        else{
        res.status(200).send({'status':'200','data':result});
        }
        console.log("GET /api/normal-log: Normal Log requested.");
    });

}

//export function for advance-search
exports.getAdvanceSearch = function (req, res){
    normalLogBl.normalLogAdvanceSearch(req, function(result){
        if(req.query.count && req.query.count=="true")
        {
            normalLogBl.normalLogTotalCount(function(count){
                res.status(200).send({'status':'200','data':result,'count':count});
            });
        }
        else{
        res.status(200).send({'status':'200','data':result});
        }
        console.log("GET /api/normal-log-advance-search")
    });
   
}

//post Normal Log
exports.postNormalLog = function(req,res)
{
    var data =req.body.data;
    var headers = req.header.toString('utf8');

    logger.addNormLog(data, function (err,result){
        if(err){
            throw err;
        }
    })
    console.log("POST /api/normlog: Normal Log added.");
    res.status(201).send({'status':'201', 'message':'Normal Log added successfully'});
  //  res.status(201).set('normlLog','/api/normlog/'+req.body).end();
} 


exports.getLogTypeAggregate = function (req,res)
{
    normalLogBl.getLogTypeCount(req, function(result){
        res.status(200).send({'status':'200','data':result});
    })
    console.log("GET /api/normallog/logaggregate: Normal Log Aggregate for different status type Requested");
}
