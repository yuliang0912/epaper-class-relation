/**
 * Created by yuliang on 2016/11/7.
 */

// SELECT cw_groupclassmember.*,cw_usernote.Curriculum,cw_usernote.Phone FROM cw_groupclassmember
// INNER JOIN cw_class ON  cw_groupclassmember.GCID = cw_class.CID
// LEFT JOIN cw_usernote ON cw_groupclassmember.NID = cw_usernote.ID

var knex = require('../configs/knex')

module.exports = function () {
    importMemberList()
}

function importMemberList() {
    knex.oldRelationKnex('cw_groupclassmember')
        .innerJoin('cw_class', 'cw_groupclassmember.GCID', 'cw_class.CID')
        .leftJoin('cw_usernote', 'cw_groupclassmember.NID', 'cw_usernote.ID')
        .select('cw_groupclassmember.*', 'cw_usernote.Curriculum', 'cw_usernote.Phone')
        .where('cw_groupclassmember.importTag', 0).orderBy('schoolId').limit(50)
        .map(item=> {
            return {
                sid: item.ID,
                classId: item.GCID || 0,
                userId: item.UserID || 0,
                userName: item.UserName || '',
                status: item.UserStatus || 0,
                createDate: item.AddDate || new Date().toLocaleString(),
                updateDate: item.UpdateDate || new Date().toLocaleString(),
                userRole: item.UserIdentity || 0,
                subjectId: isNaN(item.Curriculum) ? 0 : parseInt(item.Curriculum),
                mobile: item.Phone || '',
                isMaster: 0,
                schoolId: 0,
                brandId: 0  //isMaster,schoolId,brandId后面通过sql语句更新
            }
        })
        .then(list=> {
            if (list.length == 0) {
                console.log('end')
                return
            }
            var idList = list.map(t=> {
                var sid = t.sid
                delete t.sid
                return sid
            })
            return knex.newRelationKnex.batchInsert('classMember', list).then(t=> {
                setOldStats(idList, 1)
            }).catch(err=> {
                console.log(err)
                setOldStats(idList, 2)
            }).finally(importMemberList)
        })
}

function setOldStats(idList, value) {
    return knex.oldRelationKnex('cw_groupclassmember').whereIn('ID', idList)
        .update('importTag', value).then(t=>console.log('success'))
}