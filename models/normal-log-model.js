var mongoose =require('mongoose');
var objectId = require('mongodb').ObjectID;
//normal log schema
var normalLogScheme = mongoose.Schema({
    parameters: {
        type: String,
    },
    result:{
        type:String,
    },
    trans_id:{
        type:String,
    },
	//health status
	trans_health_type:{
	    type:Number
    },
    timestamp:{
        type:String
    },
    //info,debug,...
    status:{
        type:String,
    },
    exception_type:{
        type:String,
    },
    exception_detail:{
        type:String,
    },
    //logged in user
    user_id:{
        type:String,
    },
    //perticular method called
    method:{
        type:String,
    },
    device_type:{
        type:String,
    },
    service_type:{
        type:String
    }
})
//
var normalLog = module.exports = mongoose.model('normalLog',normalLogScheme);



