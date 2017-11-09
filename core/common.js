
module.exports.convertToISO = function(datetime1)
{
    var datetime = new Date(datetime1);
    //converting to ISO datetime
   // datetime.setHours(datetime.getHours() + 5);
    //datetime.setMinutes(datetime.getMinutes()+ 45);
    //conversion end
    return datetime;
}