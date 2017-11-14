var convertToISO = require("../core/common");
var commonDa = require("../da/da-common");
var collection = "httplogs";


module.exports.getHttpLogs= function(req,callback)
{
    var vm = "httpLogVM";
    var query =getHttpLogQuery(req);
    var queryReq = commonDa.getQueryReq(req,vm);
    commonDa.executeQuery(query,queryReq,collection,function(result){
        console.write(result);
        return callback(result);
    })
    //for testing
  /*  db.collection(collection).find(query).toArray(function(err,items){
        console.log(items);
        return callback(items);
    });*/
}

//query generation for Http detail log
function getHttpLogQuery(reqs)
{
    var query={};

    if(reqs.query.user_id)
        {
            query1 = { "user_id" :  reqs.query.user_id };
            query = Object.assign({},query,query1);
        }
        //query for timestamp range
    if(reqs.query.start && reqs.query.end)
     {
         start = common.convertToISO(reqs.query.start).toISOString();
         end = common.convertToISO(reqs.query.end).toISOString();
         query1={ timestamp:{$gte:start, $lte:end}};
         query= Object.assign({},query,query1);
     }
     else if(reqs.query.start)
     {
         start = common.convertToISO(reqs.query.start).toISOString();
         query1={ timestamp:{$gte:start}};
         query= Object.assign({},query,query1);
     }
     else if(reqs.query.end)
     {
         end = common.convertToISO(reqs.query.end).toISOString();
         query1={ timestamp:{$lte:end}};
         query= Object.assign({},query,query1);
     }
     else{
         var date =new Date();
         start = date;
         end = common.convertToISO(date).toISOString();
         start.setDate(start.getDate()-30);
         start =common.convertToISO(start).toISOString();
         query1={ timestamp:{$gte:start, $lte:end}};
         query= Object.assign({},query,query1);
     }
     ///
    if(reqs.query.log_id)
        {
            var logid = new objectId(reqs.query.log_id);
            query1 = { "_id": logid };
            query=Object.assign({},query,query1);
        }
    if(reqs.query.trans_id)
        {
            query1 = { "trans_id" :  reqs.query.trans_id };
            query = Object.assign({},query,query1);
        }
    if(reqs.query.trans_health_type)
        {
            var trans_health_type= parseInt(reqs.query.trans_health_type);
            query1 = {"trans_health_type": trans_health_type}
            query = Object.assign({},query,query1);
        }
    if(reqs.query.device_type)
        {
            query1 = {"device_type": reqs.query.device_type}
            query = Object.assign({},query,query1);         
        }
    if(reqs.query.service_type)
        {
            query1 = {"service_type": reqs.query.service_type}
            query = Object.assign({},query, query1);
        }
    if(reqs.query.system_type)
        {
            system_type = parseInt(reqs.query.system_type);
            query1= {"system_type":system_type}
            query = Object.assign({},query, query1);
        }
    if(req.query.instance_type)
        {
            query1= {"instance_type": req.query.instance_type};
            query = Object.assign({},query, query1);
        }
    if(req.query.http_verb)
        {
            query1= {"http_verb": req.query.http_verb};
            query = Object.assign({},query, query1);
        }
        return query;
}
