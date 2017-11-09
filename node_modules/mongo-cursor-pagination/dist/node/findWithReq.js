function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var find = require('./find');
var dotFieldIntersect = require('./utils/dotFieldIntersect');
var _ = require('underscore');

/**
 * A wrapper around `find()` that make it easy to implement a basic HTTP API using Express. So your
 * user can call "/list?limit=1&fields=_id,name" and the querystring parameters will be passed
 * to this method on the Express request object.
 *
 * @params {ExpressRequest} req An express request object with the following on the querystring:
 *    -limit: If a numeric string, passed to `find()` as the limit. If limit also passed in params
 *      then this value cannot exceed it.
 *    -next: If a non-empty string, passed to `find()` as the next cursor.
 *    -previous: If a non-empty string, passed to `find()` as the previous cursor.
 *    -fields: If a non-empty string, used to limit fields that are returned. Multiple fields
 *      can be specified as a comma-delimited list. If field name used is not in params.fields,
 *      it will be ignored.
 * @params {MongoCollection} collection A collection object returned from the mongoist package's
 *    `db.collection(<collectionName>)` method.
 * @param {Object} params See documentation for `find()`.
 */
module.exports = (() => {
  var _ref = _asyncToGenerator(function* (req, collection, params) {
    params = params || {};

    if (!_.isEmpty(req.query.limit)) {
      var limit = parseInt(req.query.limit);
      // Don't let the user specify a higher limit than params.limit, if defined.
      if (!isNaN(limit) && (!params.limit || params.limit > limit)) {
        params.limit = limit;
      }
    }

    if (!_.isEmpty(req.query.next)) {
      params.next = req.query.next;
    }

    if (!_.isEmpty(req.query.previous)) {
      params.previous = req.query.previous;
    }

    if (!_.isEmpty(req.query.fields)) {
      var fields = req.query.fields.split(',');
      if (params.fields) {
        // Don't trust fields passed in the querystring, so whitelist them against the
        // fields defined in parameters.
        fields = dotFieldIntersect(Object.keys(params.fields), fields);
      }
      params.fields = fields.reduce(function (accum, field) {
        accum[field] = 1;
        return accum;
      }, {});
    }

    return find(collection, params);
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();