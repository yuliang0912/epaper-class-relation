/**
 * Created by yuliang on 2016/9/30.
 */

'use strict'

var dbContents = require('../../configs/database').getDbContents()

module.exports = {
    getUserClass: getUserClass,
    createClass: createClass,
    deleteClass: deleteClass,
    updateClass: updateClass,
    getClassInfo: getClassInfo,
    getClassList: getClassList,
    getPeriodByGrade: getPeriodByGrade,
    getClassPageList: getClassPageList,
    resetClassMemberNum: resetClassMemberNum
}

function resetClassMemberNum(classId) {
    var sql = `UPDATE classInfo SET 
        studentNum = (SELECT COUNT(*) FROM classmember WHERE userRole = 1 AND classId = classInfo.classId AND status = 0),
        teacherNum = (SELECT COUNT(*) FROM classmember WHERE userRole = 2 AND classId = classInfo.classId AND status = 0)
        WHERE classId = ${classId}`;

    return dbContents.relation.query(sql, {
        raw: true,
        type: 'BULKUPDATE'
    })
}

function getUserClass(userId) {
    return dbContents.relation.classInfo.findAll({
        raw: true,
        include: [{
            attributes: ['userRole'],
            model: dbContents.relation.classMembers,
            where: {userId, status: 0}
        }],
        where: {status: 0},
        order: 'classMembers.createDate DESC'
    })
}

function getClassInfo(condition) {
    return dbContents.relation.classInfo.findOne({where: condition, raw: true});
}

function getClassList(condition) {
    return dbContents.relation.classInfo.findAll({where: condition, raw: true});
}

function createClass(model) {
    return dbContents.relation.classInfo.create(model)
}

function updateClass(model, condition) {
    return dbContents.relation.classInfo.update(model, {where: condition})
}

function getClassPageList(condition, page, pageSize) {
    var settings = {
        where: condition,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        raw: true,
        order: 'classId DESC'
    }
    return dbContents.relation.classInfo.findAndCount(settings).then(result => {
        return {
            page,
            pageSize,
            totalCount: result.count,
            pageCount: Math.ceil(result.count / pageSize),
            pageList: result.rows
        }
    })
}

function deleteClass(brandId, classIds) {
    var sql = `UPDATE classInfo
           INNER JOIN classMember ON classInfo.classId = classMember.classId
           SET classInfo.status = 1,classInfo.updateDate = NOW(),classMember.status = 2,classMember.updateDate = NOW()
           WHERE classInfo.classId IN (${classIds.toString()}) AND classInfo.brandId = ${brandId}`;

    return dbContents.relation.query(sql, {
        raw: true,
        type: 'BULKUPDATE'
    })
}

function getPeriodByGrade(grade) {
    switch (grade) {
        case 1101:
        case 1102:
        case 1103:
        case 1104:
        case 1105:
        case 1106:
            return 2;
        case 1107:
        case 1108:
        case 1109:
            return 4;
        case 1111:
        case 1112:
        case 1113:
            return 8;
        case 1114:
        case 1115:
        case 1116:
        case 1117:
            return 16;
        case 1118:
        case 1119:
        case 1120:
        case 1121:
            return 1;
        default:
            return 0;
    }
}


