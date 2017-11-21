
var convertToISO = function (datetime1) {
    var datetime = new Date(datetime1);
    //converting to ISO datetime
    // datetime.setHours(datetime.getHours() + 5);
    //datetime.setMinutes(datetime.getMinutes()+ 45);
    //conversion end
    return datetime;
}

//merge obj2 with obj1
//need to refactor
var mergeObj = function (obj1, obj2) {
    var origLength = obj1.length;
    var updatingLength = obj2.length;
    for (i = origLength - 1; i >= 0; i--) {
        for (j = updatingLength - 1; j >= 0; j--) {
            if (obj1[i]._id === obj2[j]._id) {
                obj1[i] = obj2[j];
            }
        }
    }
    return obj1;
}
//function for mapping to front end log summary
var changeToDefault = function (obj) {
    var one = [];
    var two = [];
    var three = [];
    var defaults = [];
    for (i = 0; i < obj.length; i++) {
        one.push(obj[i].id);
        two.push(obj[i].type);
        three.push(obj[i].count);
    }
    defaults.push(one);
    defaults.push(two);
    defaults.push(three);
    return defaults;

}

//for specific date range / set default datetime range
var checkDateRange = function (reqs) {
    var start; var end;
    if (reqs.query.start_date && reqs.query.end_date) {
        start = convertToISO(reqs.query.start_date).toISOString();
        end = convertToISO(reqs.query.end_date).toISOString();

    }
    else if (reqs.query.start_date) {
        start = convertToISO(reqs.query.start_date).toISOString();;

    }
    else if (reqs.query.end_date) {
        end = convertToISO(reqs.query.end_date).toISOString();;
    }
    else {
        var date = new Date();
        start = date;
        end = convertToISO(date).toISOString();;
        start.setDate(start.getDate() - 30);
        start = convertToISO(start).toISOString();;

    }
    var time = {
        start: start,
        end: end
    };
    return time;
}

module.exports = {
    convertToISO: convertToISO,
    checkDateRange: checkDateRange,
    changeToDefault: changeToDefault,
    mergeObj: mergeObj
}; 