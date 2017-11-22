var normalLogdl = require('../da/normal-log-dl');
var httplogdl = require('../da/http-log-dl');
var common = require('../core/common');


//function for normal Log deatils
normalLog = function (req, callback) {
    normalLogdl.getNormalLog(req, function (result) {
        return callback(result);
    });
}

//normalLog Total count
normalLogTotalCount = function (callback) {
    normalLogdl.totalNormalLogCount(function (result) {
        return callback(result);
    })
}
//returns Log level Type count
getLogTypeCount = function (req, cb) {
    var time = common.checkDateRange(req);
    var newdata = [];
    httplogdl.logAggHttpCount(time, function (httpCount) {
        normalLogdl.logAggNormCount(time, function (normalCount) {
            newdata.push(createSuccessObject(httpCount, normalCount));
            normalLogdl.logTypeCount(time, function (data) {
                for (i = 0; i < data.length; i++) {
                    var data1 = new Object;
                    data1.id = data[i]._id;
                    data1.type = LogTypeParse(data[i]._id);
                    data1.count = data[i].count;
                    newdata.push(data1);
                }
                //  console.log(newdata);   
                var final = common.changeToDefault(newdata);
                return cb(final);
            });
        });
    })

}

//normal-log advance search
normalLogAdvanceSearch = function (req, callback) {
    normalLogdl.advanceSearchResult(req, function (result) {
        //console.log(result);
        return callback(result);
    });
}


//create successObject
function createSuccessObject(data, data1) {
    count = data - data1;
    // console.log(count);
    var success = new Object;
    success.id = 0;
    success.type = "Success";
    success.count = count;
    return success;
}

//mapping to default level type
function LogTypeParse(type) {
    switch (type) {
        case 1: return "All";
        case 2: return "Debug";
        case 3: return "Info";
        case 4: return "Warning";
        case 5: return "Error";
        case 6: return "Fatal";
        case 7: return "Off";
    }
    return "None";
}

//public export functions
module.exports = {
    normalLogAdvanceSearch: normalLogAdvanceSearch
    , getLogTypeCount: getLogTypeCount
    , normalLogTotalCount: normalLogTotalCount
    , normalLog: normalLog
}