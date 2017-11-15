//load require packages
var express= require('express');
var bodyParser = require('body-parser');
var normalLogController = require('./controller/normal-log-controller');
var httpLogController = require("./controller/http-log-controller");
var app = express();

app.use(bodyParser.json());
var router = express.Router();

//route for normal log
router.route('/normal-log')
.get(normalLogController.normalLogGet)


//route for normallog aggregate
router.route('/normal-log-summary')
.get(normalLogController.getLogTypeAggregate)

//router for normal advance search
router.route('/normal-log-advance-search')
.get(normalLogController.getAdvanceSearch)


router.route('/http-log')
.get(httpLogController.httpLogGet)

router.route('/http-log-advance-search')
.get(httpLogController.getAdvanceSearch)


//router.route('/allnormal')
//.get(normalLogController.allNormalLog)

app.use('/api',router);
app.listen(2001);
console.log("Logger Listening...");
//error handle      
process.on('uncaughtException', function (err) {
    // logging here, maybe?
    console.log(err);
});