var dbconfig = require("../core/dbconf");
var start = dbconfig.getdb();

//get limit,sortorder,offset,limit columns
exports.getQueryReq = function(req)
{
    var queryReq = {};
    var sort = getSort(req);
    var fields = getFields(req);
    //console.log(query);
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
    queryReq = {
        "limit" :limit,
        "sort" :sort,
        "skip" :skip,
        "fields": fields
    }
    return queryReq;
}


module.exports.getCount = function(collection,callback)
{
    var db = dbconfig.db();
    db.collection(collection).find().count(function(err,result){
        if(err) throw err;
        return callback(result);
    });
}

//execute Mongoquery
module.exports.executeQuery = function (query, queryReq, collection, callback)
{
    var db = dbconfig.db();
   // console.log(query + queryReq.columns + queryReq.skip + queryReq.limit + queryReq.sort);
     db.collection(collection).find(query,queryReq.fields).skip(queryReq.skip).limit(queryReq.limit).sort(queryReq.sort).toArray(function(err, result) {
        if (err) throw err;
       // console.log(result);
        return callback(result);
    });
}

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

function getFields(req)
{
 var obj={};
 if(req.query.fields && req.query.fields!="")
 {
    var a = req.query.fields.split(",");
    for(i=0;i<a.length;i++)
        {
             obj[a[i]] = 1;
        }
}
 return obj;
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