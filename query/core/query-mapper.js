


//map comparision operator
function mapComparisionOp(comOp) {
    switch (comOp) {
        case "=": return "$eq"; //equal to
        case ">": return "$gt"; //greater than
        case ">=": return "$gte"; //greater than & equal to
        case "<": return "$lt"; //less than
        case "<=": return "$lte"; //less than & equal to
        case "<>": return "$ne"; //not equal to
        case "LIKE": return "$regex"; //Like
    }
}

//map logical operator
function mapLogialOp(LogicalOp) {
    switch (LogicalOp) {
        case "OR": return "$or";
        case "AND": return "$and";
    }
}

module.exports.queryMapper = function (conditions, callback) {
    var val = conditions.length - 1;
    result = generateQuery(conditions, val);
    //console.log(result);
    console.log(JSON.stringify(result));
    return callback(result);
}

function appendToValue(value)
{
    var reg = new RegExp(value, "i");
    console.log(reg);
    return reg //reg;
}

//generate query for Mongo
function generateQuery(condition, val) {
    var columns = condition[val].column;
    var op = mapComparisionOp(condition[val].operator);1
    var value;
    if(op=="$regex")
    {
        value = appendToValue(condition[val].value);
    }
    else{
        value = condition[val].value;
    }
    var logical;
    if (val == 0) {
        return result = { [columns]: { [op]: value } };
    }
    else {
        logical = mapLogialOp(condition[val].logical);
        return result = { [logical]: [{ [columns]: { [op]: value } }, generateQuery(condition, val - 1)] };
    }
}

