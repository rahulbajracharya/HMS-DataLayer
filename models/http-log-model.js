header: { type: String, },
url: { type: String, },
body: { type: String, },
http_verb: { type: String, },
trans_id: { type: String, },
//health status
trans_health_type: { type: Number },
parameters: { type: String, },
device_type: { type: String, },
instance_type: { type: Number, },
// determine which layer: apigateway: 4, queue: 3, databaase : 2
service_type: { type: Number, },
// determines which system logged logs
system_type: { type: Number, },
//logged in user
user_id: { type: String },
timestamp: { type: String },
requested_timestamp:{ type: String }