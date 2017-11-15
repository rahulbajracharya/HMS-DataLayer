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
exports.db = function ()
{
    return db;
}

module.exports.getdb = function(){
    MongoClient.connect(url, function(err, db1) {
        if(err) throw err;
        db=db1;
    })
}