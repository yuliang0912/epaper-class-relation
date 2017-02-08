/**
 * Created by yuliang on 2016/10/18.
 */
'use strict'

var Cache = require('./cache');
var utils = require('../../libs/api_utils')
var classProvider = require('../data_providers/class_provider')
var classMemberProvider = require('../data_providers/class_member_provider')

module.exports = {
    getMemberInfo: function (classId, userId) {
        return classMemberProvider.getClassMembers({classId, userId}).then(results=> results[0])
    },
    getClassMembers: function (classId, userRole, keyWords) {
        var cache = new Cache()
        var key = cache.getKeys.classMembers(classId)

        return cache.getModel(key).then(data=> {
            if (!data) {
                data = classMemberProvider.getClassMembers({classId, status: 0}).then(utils.convert)
                data.then(members=>members.length > 0 && cache.setModel(key, members))
            }
            return data
        }).then(members=> {
            if (userRole > 0 || keyWords.length > 0) {
                members = members.filter(item=> {
                    var flag = true
                    if (userRole > 0) {
                        flag = item.userRole === userRole
                    }
                    if (flag && keyWords.length > 0) {
                        flag = item.userName !== undefined
                            && item.userName !== null
                            && item.userName.indexOf(keyWords) > -1;
                    }
                    return flag;
                })
            }
            return members
        })
    },
    getSchoolMembers: function (brandId, schoolIds, userRole, keyWords) {
        var condition = {brandId, schoolId: {$in: schoolIds}, status: 0}
        if (userRole > 0) {
            condition.userRole = userRole
        }
        if (keyWords.length > 0) {
            condition.userName = {$like: '%' + keyWords + '%'}
        }
        return classMemberProvider.getClassMembers(condition).then(utils.convert)
    },
    addClassMember: function (memberInfo) {
        if (memberInfo.userId < 10001) {
            throw  new Error('尚未实现自动注册用户功能')
            //注册流程,初始密码相关
            memberInfo.userId = 1;
        }
        return classMemberProvider.addClassMember(memberInfo).then(data=> {
            if (data.id > 0) {
                var cache = new Cache()
                cache.del(cache.getKeys.classMembers(memberInfo.classId))
                classProvider.resetClassMemberNum(memberInfo.classId).then(rows=> {
                    rows && cache.del(cache.getKeys.classInfo(memberInfo.classId))
                })
            }
            return data.id;
        })
    },
    removeClassMember: function (brandId, classId, schoolId, userId) {
        return classMemberProvider.updateClassMember({status: 1, updateDate: Date.now()}, {
            brandId,
            classId,
            schoolId,
            userId,
            status: {$ne: 1}
        }).then(result=> {
            if (result[0] > 0) {
                var cache = new Cache()
                cache.del([cache.getKeys.classMembers(classId), cache.getKeys.userClasses(userId)])
                classProvider.resetClassMemberNum(classId).then(rows=> {
                    rows && cache.del(cache.getKeys.classInfo(classId))
                })
            }
            return result[0];
        })
    },
    updateClassMember: function (memberInfo) {
        var condition = {
            brandId: memberInfo.brandId,
            classId: memberInfo.classId,
            schoolId: memberInfo.schoolId,
            userId: memberInfo.userId
        }
        var modiflyModel = {updateDate: Date.now()}

        if (memberInfo.userName.length > 0) {
            modiflyModel.userName = memberInfo.userName
        }
        if (memberInfo.userRole > 0) {
            modiflyModel.userRole = memberInfo.userRole
        }
        if (memberInfo.subjectId > 0) {
            modiflyModel.subjectId = memberInfo.subjectId
        }
        if (memberInfo.mobile.length > 0) {
            modiflyModel.mobile = memberInfo.mobile
        }
        if (memberInfo.isMaster > -1) {
            modiflyModel.isMaster = memberInfo.isMaster
        }
        return classMemberProvider.updateClassMember(modiflyModel, condition).then(result=> {
            if (result[0] > 0) {
                var cache = new Cache()
                cache.del(cache.getKeys.classMembers(memberInfo.classId))
            }
            return result[0];
        })
    },
    updateMemberStatus: function (id, classId, status) {
        return classMemberProvider.updateClassMember({status, updateDate: Date.now()}, {id}).then(result=> {
            if (result[0] > 0) {
                var cache = new Cache()
                cache.del(cache.getKeys.classMembers(classId))
            }
            return result[0];
        })
    }
}
