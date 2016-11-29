/**
 * Created by yuliang on 2016/11/4.
 */

// SELECT cw_class.* from cw_groupclass
// INNER JOIN cw_class ON cw_class.CID = cw_groupclass.ID
// where AuthType = 2

var knex = require('../configs/knex')

module.exports = function () {
    importClassList()
}

function importClassList() {
    knex.oldRelationKnex('cw_groupclass')
        .innerJoin('cw_class', 'cw_class.CID', 'cw_groupclass.ID')
        .where({AuthType: 2, importTag: 0}).orderBy('cw_class.CID').limit(50)
        .select('cw_class.*', 'cw_groupclass.CreateUserId', 'cw_groupclass.CreateDate', 'cw_class.UpdateDate', 'cw_groupclass.GroupState').map(item=> {
        return {
            classId: item.CID,
            className: item.ClassAliasName || '',
            schoolId: item.SchoolID || 0,
            schoolName: '',
            classYear: item.ClassYear || 0,
            grade: item.GradeID || 0,
            period: item.PeriodID || 0,
            studentNum: item.StudentSize || 0,
            teacherNum: item.TeacherSize || 0,
            brandId: 0,
            createUserId: item.CreateUserId || 0,
            createDate: item.CreateDate || new Date().toLocaleString(),
            updateDate: item.UpdateDate || new Date().toLocaleString(),
            status: item.GroupState || 0
        }
    }).then(classList=> {
        if (classList.length == 0) {
            console.log('end')
            return
        }
        var classIds = classList.map(item=>item.classId)
        knex.newRelationKnex.batchInsert('classInfo', classList)
            .then(t=> {
                setOldStats(classIds, 1)
            }).catch(err=> {
            console.log(err)
            setOldStats(classIds, 2)
        }).finally(importClassList)
    })
}

function setOldStats(classIds, value) {
    return knex.oldRelationKnex('cw_class').whereIn('CID', classIds)
        .update('importTag', value).then(t=>console.log('success'))
}
