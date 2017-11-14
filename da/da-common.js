var normalLogVM = require("../models/normal-log-VM");
var httpLogVM = require("../models/http-log-VM");


exports.getQueryReq = function(req, collectionVM)
{
    var queryReq = {};
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
    var vm = collectionVM.getLogVM();
    queryReq = {
        "limit" :limit,
        "sort" :sort,
        "skip" :skip,
        "columns": vm
    }
    return queryReq;
}

module.exports.executeQuery = function(query, queryReq, collection)
{
    db.collection(collection).find(queryReq.query,queryReq.columns).skip(queryReq.skip).limit(queryReq.limit).sort(queryReq.sort).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        return result;
    })
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

//map sort order
function getSortOrder(order)
{
    switch(order)
    {
        case "asc" : return 1;
        case "desc" : return -1;
    }
}