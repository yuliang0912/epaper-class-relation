/**
 * Created by yuliang on 2016/9/30.
 */

var client = require('./redisClient')

module.exports = {
    getClassInfo: getClassInfo,
    getClassListBySchoolId: getClassListBySchoolId
}

function getClassInfo(classId) {
    client.hgetAsync()
}