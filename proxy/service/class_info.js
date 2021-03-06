/**
 * Created by yuliang on 2016/9/30.
 */
'use strict'

var Cache = require('./cache');
var utils = require('../../lib/api_utils')
var classProvider = require('../data_providers/class_provider')
var classMemberProvider = require('../data_providers/class_member_provider')

module.exports = {
    getUserClass: function (userId, userRole) {
        var cache = new Cache()
        var key = cache.getKeys.userClasses(userId)
        var getUserClass = function () {
            return classProvider.getUserClass(userId).then(data=> {
                data.forEach(item=> {
                    item.userRole = item['classMembers.userRole']
                    delete item['classMembers.userRole']
                })
                return data
            }).then(utils.convert)
        }
        return cache.getModel(key).then(classList=> {
            if (!classList) {
                classList = getUserClass()
                classList.then(data=>cache.setModel(key, data))
            }
            if (userRole > 0) {
                classList = classList.filter(t=>t.userRole === userRole)
            }
            return classList
        }).catch(getUserClass)
    },
    createClass: function (classInfo) {
        var now = new Date();
        classInfo.classYear = now.getMonth().getMonth < 8
            ? now.getFullYear() - 1
            : now.getFullYear();
        classInfo.period = classProvider.getPeriodByGrade(classInfo.grade)
        return classProvider.createClass(classInfo)
    },
    deleteClass: function (brandId, classIds) {
        return classProvider.deleteClass(brandId, classIds).then(data=> {
            if (data > 0) {
                var cache = new Cache()
                var keys = [];
                classIds.forEach(item=> {
                    keys.push(cache.getKeys.classMembers(item))
                    keys.push(cache.getKeys.classInfo(item))
                })
                classMemberProvider.getClassMembers({classId: {$in: classIds}, status: 2}).then(classMembers=> {
                    classMembers.forEach(m=>keys.push(cache.getKeys.userClasses(m.userId)));
                    cache.del(keys)
                })
            }
            return data;
        })
    },
    getClassInfo: function (classId) {
        var cache = new Cache()
        var key = cache.getKeys.classInfo(classId)
        var getClassInfo = function getClassInfo() {
            return classProvider.getClassInfo({classId, status: 0}).then(utils.convert)
        }
        return cache.getModel(key).then(classInfo=> {
            if (!classInfo) {
                classInfo = getClassInfo()
                classInfo.then(data=>cache.setModel(key, data))
            }
            return classInfo
        }).catch(getClassInfo)
    },
    updateClassGrade: function (brandId, classIds, grade) {
        var model = {
            grade,
            period: classProvider.getPeriodByGrade(grade),
            updateDate: Date.now()
        }

        return classProvider.updateClass(model, {brandId, classId: {$in: classIds}}).then(data=> {
            if (data[0] > 0) {
                var cache = new Cache()
                var keys = classIds.map(item=>cache.getKeys.classInfo(item));
                classMemberProvider.getClassMembers({classId: {$in: classIds}, status: 0}).then(classMembers=> {
                    classMembers.forEach(m=>keys.push(cache.getKeys.userClasses(m.userId)));
                    cache.del(keys)
                })
            }
            return data
        })
    },
    getClassListBySchoolIds: function (brandId, schoolIds, period, grade, page, pageSize) {
        var condition = {brandId, schoolId: {$in: schoolIds}, status: 0}
        if (period) {
            condition.period = period;
        }
        if (grade) {
            condition.grade = grade;
        }
        return classProvider.getClassPageList(condition, page, pageSize).then(data=> {
            data.pageList.forEach(utils.convert)
            return data;
        })
    }
}

// 缓存策略更新为如果有查询需求,则第一次查询时进行缓存
// 当缓存的源数据发生变化时,则直接删除缓存.下一次查询时再次缓存最新数据
// function resetClassInfoCache(condition) {
//     var cache = new Cache()
//     classProvider.getClassList(condition).then(classList=> {
//         classList.forEach(classInfo=> {
//             let key = cache.getKeys.classInfo(classInfo.classId)
//             cache.setModel(key, utils.convert(classInfo))
//         })
//     })
// }
// getClassInfo1: function (classId) {
//     var client = redisClient.getClient()
//     var key = redisClient.getKeys.classInfo(classId)
//     var getClassInfo = function getClassInfo() {
//         return classProvider.getClassInfo({classId}).then(utils.convert)
//     }
//     if (!client) {
//         return getClassInfo();
//     }
//     return client.getAsync(key).then(JSON.parse).then(classInfo=> {
//         if (!classInfo) {
//             classInfo = getClassInfo()
//             classInfo.then(data=>data && redisClient.setData.setModel(key, data))
//         }
//         return classInfo
//     }).catch(getClassInfo)
// },