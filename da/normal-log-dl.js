//var mongoose =require('mongoose');
var dbconfig = require('../core/dbconf');
var normalLog= require('../models/normal-log-model');
var common = require('../core/common');
var normalLogVM = require("../models/normal-log-VM");
var mongoPaging = require('mongo-cursor-pagination');
var queryBuilder =require('../core/query-mapper');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var configuration = require('../configuration');
var url= format("mongodb://%s,%s,%s/%s?replicaSet=%s&readPreference=%s&connectTimeoutMS=30000"
, "10.0.84.68:27017"
, "10.0.84.68:27018"
, "10.0.84.68:27019"
, "data"
, "hmsreplset"
, "secondaryPreferred");

var db;
var testdb;
var temp;
var url1 = "mongodb://localhost/test"
var collection = "normallogs";
MongoClient.connect(url, function(err, db1) {
     if(err) throw err;
    db=db1;
})

//for test purpose
//var mongodb = require('mongodb');
//var MongoClient = require('mongodb').MongoClient, format = require('util').format;



 
//MongoClient.connect(dbconfig.url, function(err, db1) {
  //  if(err) throw err;
   // db=db1;
//})

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


//advance search result
module.exports.advanceSearchResult = function (req, callback)
{
    var condition = JSON.parse(req.query.condition);
    queryBuilder.queryMapper(condition.data, function (query){
        console.log(query);
        var queryReq = getQueryReq(req);
         module.executeQuery(query,queryReq,function(data){
            return callback(data);
        })
    });
}

//execute query
module.executeQuery = function (query, queryReq, callback)
{
   // console.log(query + queryReq.columns + queryReq.skip + queryReq.limit + queryReq.sort);
    db.collection(collection).find(query,queryReq.columns).skip(queryReq.skip).limit(queryReq.limit).sort(queryReq.sort).toArray(function(err, result) {
        if (err) throw err;
       // console.log(result);
        return callback(result);
    });
}

//get query requirements
function getQueryReq(req)
{
    var queryReq={};
    var sort = getSort(req);
    var limit = 0;
    var skip = 0;
    if(req.query.limit)
     {
         limit = parseInt(req.query.limit);
     }
     if(req.query.offset)
     {
        skip = parseInt(req.query.offset);
     }
    var logVm = normalLogVM.getNormalLogVM();
    queryReq ={
        "sort": sort,
        "limit": limit,
        "skip": skip,
        "columns": logVm
    }
    return queryReq;
}

//get detail log
module.exports.getNormalLog= function(req,callback)
{
    var query =getLogQuery(req);
    var sort = getSort(req);
    console.log(query);
    var limit = 0;
    var skip = 0;
    if(req.query.limit)
     {
         limit = parseInt(req.query.limit);
     }
     if(req.query.offset)
     {
        skip = parseInt(req.query.offset);
     }
    var logVm = normalLogVM.getNormalLogVM();
    //console.log(logVm);

    //for testing
  /*  db.collection(collection).find(query).toArray(function(err,items){
        console.log(items);
        return callback(items);
    });*/
    db.collection(collection).find(query,logVm).skip(skip).limit(limit).sort(sort).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    return callback(result);
});
/*
    db.collection("normallogs").find({}).toArray(function(err,items){
        console.log(items);
    })*/
}


//get sort query;
function getSort(reqs)
{
    var sort ={};
    var order;
    if(reqs.query.sort_field && reqs.query.order)
    {
        order = getSortOrder(reqs.query.order);
        query1 = { [reqs.query.sort_field]: order }
        sort = Object.assign({},sort,query1);
    }
    else if(reqs.query.sort_field){
        order = 1;
        query1 = { [reqs.query.sort_field]: order }
        sort = Object.assign({},sort,query1);
    }
    return sort;
}

//map sort order
function getSortOrder(order)
{
    switch(order)
    {
        case "asc" : return 1;
        case "desc" : return -1;
    }
}
//query generation for detail log
function getLogQuery(reqs)
{
    var query={};

    if(reqs.query.user_id)
        {
            query1 = { "user_id" :  reqs.query.user_id };
            query = Object.assign({},query,query1);
        }
    if(reqs.query.limit)
        {
            limit = parseInt(reqs.query.limit);
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
    if(reqs.query.status)
        {
            var status = parseInt(reqs.query.status);
            query1 = {"status": status};
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
     db.collection(collection).aggregate( [ { $match: { "timestamp" : {$gte: time.start, $lte: time.end}}}, { $group :
         { _id : "$status", count:{$sum : 1} } } ] ).toArray(function(err,result){
      if(err) throw err;
     // console.log(result);
      var final = getSummaryFormat(result);
     // console.log(final);
      return callback(final);
  });
}

//for strict formating of status type.
function getSummaryFormat(result)
{
    var obje = [{_id:2,count:0}
    ,{_id:3,count:0}
    ,{_id:4,count:0}
    ,{_id:5,count:0}
    ,{_id:6,count:0}
    ,{_id:7,count:0}
    ]
    //todo-refactor
    var origLength = obje.length;
    var updatingLength = result.length;
    for(i = origLength-1; i >= 0; i--) {
        for(j = updatingLength -1; j >= 0; j--) {
        if(obje[i]._id === result[j]._id) {
            obje[i] = result[j];
        }
      }
    }
    return obje;
}

module.exports.logAggHttpCount = function (time, callback)
  {
      var normlog = normalLog;
      return callback(100); //testdata
   /*  db.collection("httpLog").aggregate( [ { $match: { "timestamp" : {$gte: time.start, $lte: time.end}}}, { $group :
        { _id : "$meta.details.trans_id"} } ] ).toArray(function(err,result){
        if (err) throw err;
        return callback(result.length);
      } );
   */
  }
  module.exports.logAggNormCount = function(time,callback)
  {
      var normlog= normalLog;
     db.collection(collection).find({$and:[{$or:[{"status" : 5}, {"status" : 6}]},{ timestamp:{$gte:time.start, $lte:time.end}}]}).count(function(err,result){
          if (err) throw err;
          return callback(result);
      });
      
  }
  


   // normlog.aggregate([{$group:{_id:normlog.status, count:{$sum:1}}}]).toArray(function(err,result){
   //     if(err) throw err;
    //    return callback(result);
  //  })

