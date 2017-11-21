var normalLog = require("../models/normal-log-model");

var finalModal = ["trans_id",
  "trans_health_type",
  "timestamp",
  "status",
  "device_type",
  "service_type"]

var testModal = [
  "timestamp",
  "meta.details.trans_health_type",
  "meta.details.trans_id",
  "meta.details.status",
  "meta.details.device_type",
  "meta.details.service_type",
]

//select test or final
var modal = finalModal;


//return normalLog view modal;
module.exports.getNormalLogVM = function () {
  return generateModal();
}

module.exports.getLogVM = function () {
  return generateModal();
}

function generateModal() {
  var obj = new Object;
  for (i = 0; i < modal.length; i++) {
    obj[modal[i]] = 1;
  }
  return obj;
}


