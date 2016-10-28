/**
 * Created by yuliang on 2016/9/30.
 */

var dbContents = require('../configs/database').getDbContents()

module.exports = {
    getSchoolInfo: getSchoolInfo,
    getSchoolList: getSchoolList
}

function getSchoolInfo(condition) {
    return dbContents.relation.schoolInfo.findOne({where: condition, raw: true});
}

function getSchoolList(condition, page, pageSize) {
    return dbContents.relation.schoolInfo.getPageList(condition, page, pageSize, 'schoolId ASC')
}