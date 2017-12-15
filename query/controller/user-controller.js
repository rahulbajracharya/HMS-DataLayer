var userBl = require('../business/user-bl');


exports.checkUserValidation = function (req, res) {
    userBl.validateUser(req, function (result) {
        res.status(result.status).send({ 'status': result.status, 'message': result.message, 'data': result.data });
        console.log("GET /api/is-user-exist: User check requested.");
    });

}