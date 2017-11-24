//load require packages
var express= require('express');
var bodyParser = require('body-parser');
var normalLogController = require('./query/controller/normal-log-controller');
var httpLogController = require("./query/controller/http-log-controller");
var userController = require("./query/controller/user-controller");
var app = express();

app.use(bodyParser.json());
var router = express.Router();
//test alkdjklasd
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

router.route('/http-log-summary')
.get(httpLogController.getHttpLogAggregate)

router.route('/http-log-advance-search')
.get(httpLogController.getAdvanceSearch)

router.route('/is-user-exist')
.get(userController.checkUserValidation)

//router.route('/allnormal')
//.get(normalLogController.allNormalLog)

app.use('/api',router);
app.listen(2002);
console.log("Logger Listening...");
//error handle      
process.on('uncaughtException', function (err) {
    // logging here, maybe?
    console.log(err);
});