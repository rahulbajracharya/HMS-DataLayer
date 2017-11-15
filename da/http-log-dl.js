var convertToISO = require("../core/common");
var commondb = require("../da/da-common");
var queryBuilder =require("../core/query-mapper");
var collection = "httplogs";

//httplog detail
module.exports.getHttpLogs= function(req,callback)
{    
    var query =getHttpLogQuery(req);
    var queryReq = commondb.getQueryReq(req);
    commondb.executeQuery(query,queryReq,collection,function(result){
       // console.write(result);
        return callback(result);
    });
}
//httplog advancesearch
module.exports.advanceSearchResult = function (req, callback)
{
    var condition = JSON.parse(req.query.condition);
    queryBuilder.queryMapper(condition.data, function (query){
        console.log(query);
        var queryReq = commondb.getQueryReq(req);
         commondb.executeQuery(query,queryReq,collection,function(data){
            return callback(data);
        })
    });
}

module.exports.totalHttpLogCount = function (callback)
{
  commondb.getCount(collection,function(result){
      return callback(result);
  })
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
    if(reqs.query.start_date && reqs.query.end_date)
     {
         start_date = common.convertToISO(reqs.query.start_date).toISOString();
         end_date = common.convertToISO(reqs.query.end_date).toISOString();
         query1={ timestamp:{$gte:start_date, $lte:end_date}};
         query= Object.assign({},query,query1);
     }
    else if(reqs.query.start_date)
     {
         start_date = common.convertToISO(reqs.query.start_date).toISOString();
         query1={ timestamp:{$gte:start_date}};
         query= Object.assign({},query,query1);
     }
    else if(reqs.query.end_date)
     {
         end_date = common.convertToISO(reqs.query.end_date).toISOString();
         query1={ timestamp:{$lte:end_date}};
         query= Object.assign({},query,query1);
     }
    else{
         var date =new Date();
         start_date = date;
         end_date = common.convertToISO(date).toISOString();
         start_date.setDate(start_date.getDate()-30);
         start_date =common.convertToISO(start_date).toISOString();
         query1={ timestamp:{$gte:start_date, $lte:end_date}};
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
