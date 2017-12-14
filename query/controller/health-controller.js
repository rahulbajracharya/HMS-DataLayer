exports.healthStatus = function(req,res)
{
    res.status(200).send({ 'status': '200'});
    console.log("GET /api/health: Health status requested.");
}