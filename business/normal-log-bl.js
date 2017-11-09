var normalLogdl = require('../da/normal-log-dl');
var common = require('../core/common');

module.exports.normalLog =function (req, callback)
{
    normalLogdl.getNormalLog(req,function(result){
        return callback(result);
    })

}

/*
//getLogAdd
module.exports.getLogAgg = function(req, callback){
    start = common.convertToISO(reqs.query.start);
    end = common.convertToISO(reqs.query.end);
    normalLogdl.logaggr(start, end, function (result){
        return callback(result);
    })
}



module.exports.getAllNormalLog = function(req,callback){
    start = common.convertToISO(req.query.start);
    end = common.convertToISO(req.query.end);
    normalLogdl.normalLogCount(start, end, function(err, data){
        if(err) throw err;
        return callback(data);
    })
}
*/

//returns Log level Type count
module.exports.getLogTypeCount = function(req, cb){
   var time = checkDateRange(req);
    var newdata = []; 
    normalLogdl.logAggHttpCount(time,function(httpCount){
        normalLogdl.logAggNormCount(time,function(normalCount){
            newdata.push(createSuccessObject(httpCount,normalCount));
            normalLogdl.logTypeCount(time ,function(data){
                for(i=0; i<data.length;i++)
                {
                    var data1 = new Object;
                    data1.id=data[i]._id;
                    data1.type= LogTypeParse(data[i]._id);
                    data1.count=data[i].count;
                    newdata.push(data1);
                }
            console.log(newdata);   
            var final = changeToDefault(newdata);
            return cb(final);  
          });
        });
    })
  
}



//create successObject
function createSuccessObject(data,data1)
{
    count = data-data1;
    console.log(count);
    var success= new Object;
    success.id=0;
    success.type="success";
    success.count=count;
    return success;
}

//Check dateRange
function checkDateRange(reqs)
{
    var start;var end;
    if(reqs.query.start && reqs.query.end)
    {
        start = common.convertToISO(reqs.query.start);
        end = common.convertToISO(reqs.query.end);
      
    }
    else if(reqs.query.start)
    {
        start = common.convertToISO(reqs.query.start);
      
    }
    else if(reqs.query.end)
    {
        end = common.convertToISO(reqs.query.end);
    }
    else{
        var date =new Date();
        start = date;
        end = common.convertToISO(date);
        start.setDate(start.getDate()-30);
        start =common.convertToISO(start);
       
    }
    var time = {
        start: start,
        end: end
    };
    return time;
}

///mapping to frontend
function changeToDefault(obj)
{
    var one = [];
    var two = [];
    var three =[];
    var defaults = [];
    for(i=0;i<obj.length;i++)
    {
        one.push(obj[i].id);
        two.push(obj[i].type);
        three.push(obj[i].count);
    }
    defaults.push(one);
    defaults.push(two);
    defaults.push(three);
    console.log(one);
    console.log(two);
    console.log(three);
    console.log(defaults);
    return defaults;
    
}


//mapping to default level type
function LogTypeParse(type)
{
    switch(type)
    {
    case '001': return "All";
    case '002': return "Debug";
    case '003': return "Info";
    case '4': return "Warning";
    case '5': return "Error";
    case '6': return "Fatal";
    case '7': return "Off";
    }
    return "None";
}

