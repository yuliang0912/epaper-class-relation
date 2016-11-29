/**
 * Created by yuliang on 2016/10/13.
 */
'use strict'

var utils = require('../../lib/api_utils')
var schoolProvider = require('../data_providers/school_provider')

module.exports = {
    getSchoolInfo: function (schoolId) {
        return schoolProvider.getSchoolInfo({schoolId}).then(utils.convert)
    },
    getUserSchool: function (userId) {
        return schoolProvider.getUserSchool(userId).then(utils.convert)
    },
    getSchoolList: function (schoolArea, period, keyWords, page, pageSize) {
        var condition = {
            schoolArea: {$like: schoolArea + '%'}
        }
        if (period) {
            condition.period = period;
        }
        if (keyWords !== undefined && keyWords.length > 0) {
            condition.schoolName = {$like: '%' + keyWords + '%'}
        }
        return schoolProvider.getSchoolList(condition, page, pageSize).then(data=> {
            data.pageList.forEach(utils.convert)
            return data;
        })
    }
}





