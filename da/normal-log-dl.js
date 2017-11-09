//var mongoose =require('mongoose');
var dbconfig = require('../configuration');
var normalLog= require('../models/normal-log-model');
var common = require('../core/common');
var normalLogVM = require("../models/normal-log-VM");
var mongoPaging = require('mongo-cursor-pagination')
//for test purpose
//var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db;
 
MongoClient.connect(dbconfig.url, function(err, db1) {
    if(err) throw err;
    db=db1;
})

/*
module.exports.logaggr = function (start,end,callback)
{
    var normlog = normalLog;
    normlog.find({timestamp:{$gte:start, $lte:end}}).count().toArray(function(err,result){
        if(err) throw err;
        return callback(result);
    })
}
*/
/*
module.exports.normalLogCount= function (back)
{
    normalLog.find({},function(err, result){
        if(err) throw err;
        db.close();
       // console.log(result);
        return back(result);
    })
}*/

//get detail log
module.exports.getNormalLog= function(req,callback)
{
    var query =getLogQuery(req);
    console.log(query);
    var limit = 0;
    if(req.query.limit)
     {
         limit = parseInt(req.query.limit);
     }
     var logVm = normalLogVM.getNormalLogVM();
     console.log(logVm);
     var result = mongoPaging.find(db.collection('normalLog'), {
        limit: 2
      });
      console.log(result);
      return callback(result);

  /*  db.collection("normalLog").find(query, logVm).limit(limit).toArray(function(err, result) {
    if (err) throw err;
    return callback(result);
});*/
}

//query generation for detail log
function getLogQuery(reqs)
{
    var limit=0;
    var query={};
    if(reqs.query.user_id)
        {
            query1 = { "meta.details.user_id" :  reqs.query.user_id };
            query = Object.assign({},query,query1);
        }
    if(reqs.query.limit)
        {
            limit = parseInt(reqs.query.limit);
        }
     //query for timestamp range
    if(reqs.query.start && reqs.query.end)
     {
         start = common.convertToISO(reqs.query.start);
         end = common.convertToISO(reqs.query.end);
         query1={ timestamp:{$gte:start, $lte:end}};
         query= Object.assign({},query,query1);
     }
     else if(reqs.query.start)
     {
         start = common.convertToISO(reqs.query.start);
         query1={ timestamp:{$gte:start}};
         query= Object.assign({},query,query1);
     }
     else if(reqs.query.end)
     {
         end = common.convertToISO(reqs.query.end);
         query1={ timestamp:{$lte:end}};
         query= Object.assign({},query,query1);
     }
     else{
         var date =new Date();
         start = date;
         end = common.convertToISO(date);
         start.setDate(start.getDate()-30);
         start =common.convertToISO(start);
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
            query1 = { "meta.details.trans_id" :  reqs.query.trans_id };
            query = Object.assign({},query,query1);
        }
    if(reqs.query.trans_health_type)
        {
            var trans_health_type= parseInt(reqs.query.trans_health_type);
            query1 = {"meta.details.trans_health_type": trans_health_type}
            query = Object.assign({},query,query1);
        }
    if(reqs.query.level)
        {
            query1 = {"level": reqs.query.level};
            query = Object.assign({},query,query1);
        }
    if(reqs.query.device_type)
        {
            query1 = {"meta.details.device_type": reqs.query.device_type}
            query = Object.assign({},query,query1);         
        }
    if(reqs.query.service_type)
        {
            query1 = {"meta.details.service_type": reqs.query.service_type}
            query = Object.assign({},query, query1);
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
 module.exports.logTypeCount = function (time, callback)
 {
     var normlog = normalLog;
     db.collection("normalLog").aggregate( [ { $match: { "timestamp" : {$gte: time.start, $lte: time.end}}}, { $group :
         { _id : "$meta.details.trans_id", count:{$sum : 1} } } ] ).toArray(function(err,result){
      if(err) throw err;
    //  console.log(result);
      return callback(result);
  });
}
  module.exports.logAggHttpCount = function (time, callback)
  {
      var normlog = normalLog;
     db.collection("httpLog").aggregate( [ { $match: { "timestamp" : {$gte: time.start, $lte: time.end}}}, { $group :
        { _id : "$meta.details.trans_id"} } ] ).toArray(function(err,result){
        if (err) throw err;
        return callback(result.length);
      } );
   
  }
  module.exports.logAggNormCount = function(time,callback)
  {
      var normlog= normalLog;
     db.collection("normalLog").find({$and:[{$or:[{"status" : "5"}, {"status" : "6"}]},{ timestamp:{$gte:time.start, $lte:time.end}}]}).count(function(err,result){
          if (err) throw err;
          return callback(result);
      });
      
  }
  


   // normlog.aggregate([{$group:{_id:normlog.status, count:{$sum:1}}}]).toArray(function(err,result){
   //     if(err) throw err;
    //    return callback(result);
  //  })

