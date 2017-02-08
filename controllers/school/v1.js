/**
 * Created by yuliang on 2016/10/13.
 */

var utils = require('../../libs/api_utils')
var knex = require('../../configs/knex')
var schoolInfoService = require('../../proxy/service/school_info')

module.exports = {
    noAuths: ['getSchoolList2', 'getSchoolList3', 'getSchoolList1'],
    getUserSchool: function *() {
        var userId = this.checkQuery('userId').default(0).toInt().value;
        this.errors && this.validateError();

        userId = userId === 0 ? this.request.userId : userId;

        yield schoolInfoService.getUserSchool(userId).then(this.success).catch(this.error)
    },
    getSchoolInfo: function *() {
        var schoolId = this.checkQuery('schoolId').notEmpty().toInt().value;
        this.errors && this.validateError();

        yield schoolInfoService.getSchoolInfo(schoolId).then(this.success).catch(this.error)
    },
    getSchoolList: function *() {
        var schoolArea = this.checkQuery('schoolArea').notEmpty().toInt().gt(0).value;
        var period = this.checkQuery('period').default(0).toInt().value;
        var keyWords = this.checkQuery('keyWords').default('').value;
        var page = this.checkQuery('page').notEmpty().toInt().gt(0).value;
        var pageSize = this.checkQuery('pageSize').notEmpty().toInt().gt(0).value;
        this.errors && this.validateError();

        yield schoolInfoService.getSchoolList(schoolArea, period, keyWords, page, pageSize).then(this.success).catch(this.error)
    },
    getSchoolList1: function *() {
        var schoolArea = this.checkQuery('schoolArea').notEmpty().toInt().gt(0).value;
        var period = this.checkQuery('period').default(0).toInt().value;
        var keyWords = this.checkQuery('keyWords').default('').value;
        var page = this.checkQuery('page').notEmpty().toInt().gt(0).value;
        var pageSize = this.checkQuery('pageSize').notEmpty().toInt().gt(0).value;
        this.errors && this.validateError();

        var currKnex = knex.newRelationKnex('schoolInfo')
            .where('schoolArea', '>=', schoolArea.toString())
            .where('schoolArea', '<', (schoolArea + 1).toString());

        if (period) {
            currKnex.where('period', period);
        }
        if (keyWords !== undefined && keyWords.length > 0) {
            currKnex.where('schoolName', 'like', '%' + keyWords + '%');
        }
        let totalItem = 0;

        yield currKnex.clone().count('* as totalItem').then(data=> {
            totalItem = data[0].totalItem;
            if (totalItem < (page - 1) * pageSize) {
                return [];
            }
            return currKnex.select('*').limit(pageSize).offset((page - 1) * pageSize).orderBy('schoolId', 'ASC');
        }).then(dataList=> {
            return utils.convertToPage(page, pageSize, totalItem, dataList)
        }).then(this.success)
    },
    getSchoolList2: function *() {
        var schoolArea = this.checkQuery('schoolArea').notEmpty().toInt().gt(0).value;
        var period = this.checkQuery('period').default(0).toInt().value;
        var keyWords = this.checkQuery('keyWords').default('').value;
        var page = this.checkQuery('page').notEmpty().toInt().gt(0).value;
        var pageSize = this.checkQuery('pageSize').notEmpty().toInt().gt(0).value;
        this.errors && this.validateError();

        this.success('this is 12-05 12:05 api')
        //this.success(utils.convertToPage(page, pageSize, 0, []))
    },
    getSchoolList3: function *() {
        this.success('this is 12-05 12:5 api')
    }
}