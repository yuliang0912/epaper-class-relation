/**
 * Created by yuliang on 2016/11/4.
 */

var knex = require('../configs/knex')

module.exports = function () {
    importSchoolList()
}

function importSchoolList() {
    knex.oldRelationKnex('cw_school').where('importTag', 0).orderBy('schoolId').limit(50).map(item=> {
        return {
            schoolId: item.SchoolID,
            schoolName: item.SchoolName || '',
            schoolArea: item.SchoolArea ? parseInt(item.SchoolArea) : 0,
            period: item.PeriodID ? item.PeriodID : 0,
            masterName: item.PrincipalName || '',
            masterMobile: item.Phone || '',
            address: '',
            createDate: item.SchoolCreateDate || new Date().toLocaleString(),
            updateDate: item.SchoolUpdateDate || new Date().toLocaleString(),
            status: item.SchoolStatus || -1
        }
    }).then(schoolList=> {
        if (schoolList.length == 0) {
            console.log('end')
            return
        }
        var schoolIds = schoolList.map(item=>item.schoolId)
        return knex.newRelationKnex.batchInsert('schoolInfo', schoolList).then(t=> {
            setOldStats(schoolIds, 1)
        }).catch(err=> {
            console.log(err)
            setOldStats(schoolIds, 2)
        }).finally(importSchoolList)
    })
}

function setOldStats(schoolIds, value) {
    return knex.oldRelationKnex('cw_school').whereIn('schoolId', schoolIds)
        .update('importTag', value).then(t=>console.log('success'))
}