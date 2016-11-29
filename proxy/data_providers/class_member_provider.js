/**
 * Created by yuliang on 2016/9/30.
 */
'use strict'

var dbContents = require('../../configs/database').getDbContents()

module.exports = {
    getClassMembers: function (condition) {
        return dbContents.relation.classMembers.findAll({where: condition, raw: true})
    },
    addClassMember: function (memberInfo) {
        return dbContents.relation.classMembers.create(memberInfo)
    },
    updateClassMember: function (model, condition) {
        return dbContents.relation.classMembers.update(model, {where: condition})
    }
}