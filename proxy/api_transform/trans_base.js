/**
 * Created by yuliang on 2016/9/30.
 */

var _ = require('underscore')


var baseTrans = module.exports.baseTrans = function (results, callBack) {
    if (!_.isArray(results)) {
        results = [results]
    }
    baseTrans.prototype.data = results
    baseTrans.prototype.toApiData = function () {
        if (_.isFunction(callBack)) {
            return callBack(results)
        }
    }
}




