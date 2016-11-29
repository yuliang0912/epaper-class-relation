/**
 * Created by yuliang on 2016/9/30.
 */

'use strict'

var dbContents = require('../../configs/database').getDbContents()

module.exports = {
    getSchoolInfo: getSchoolInfo,
    getSchoolList: getSchoolList,
    getUserSchool: getUserSchool
}

function getUserSchool(userId) {
    return dbContents.relation.schoolInfo.findAll({
        raw: true,
        include: [{
            attributes: [],
            model: dbContents.relation.classMembers,
            where: {userId, status: 0},
        }],
        order: 'classMembers.createDate DESC'
    })
}

function getSchoolInfo(condition) {
    return dbContents.relation.schoolInfo.findOne({where: condition, raw: true});
}

function getSchoolList(condition, page, pageSize) {
    return dbContents.relation.schoolInfo.getPageList(condition, page, pageSize, 'schoolId ASC')
}