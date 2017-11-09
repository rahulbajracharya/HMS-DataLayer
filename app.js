//load require packages
var express= require('express');
var bodyParser = require('body-parser');
var normalLogController = require('./controller/normal-log-controller');
var app = express();

app.use(bodyParser.json());
var router = express.Router();

//route for normal log
router.route('/normallog')
.get(normalLogController.normalLogGet)
.post(normalLogController.postNormalLog)

//route for normallog aggregate
router.route('/normallog/logaggregate')
.get(normalLogController.getLogTypeAggregate)

//router.route('/allnormal')
//.get(normalLogController.allNormalLog)

app.use('/api',router);
app.listen(3001);
console.log("Logger Listening...");