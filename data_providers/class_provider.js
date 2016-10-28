/**
 * Created by yuliang on 2016/9/30.
 */


var dbContents = require('../configs/database').getDbContents()


module.exports = {
    createClass: createClass,
    updateClass: updateClass,
    getClassInfo: getClassInfo,
    getClassList: getClassList,
    getPeriodByGrade: getPeriodByGrade,
    getClassPageList: getClassPageList
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
    return dbContents.relation.classInfo.findAndCount({
        raw: true,
        where: condition,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: 'classId ASC'
    }).then(result => {
        return {
            page,
            pageSize,
            totalCount: result.count,
            pageCount: Math.ceil(result.count / pageSize),
            pageList: result.rows
        }
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


