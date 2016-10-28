/**
 * Created by yuliang on 2016/10/13.
 */

var schoolInfoService = require('../../proxy/api_transform/school_info')

module.exports = {
    noAuths: [],
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
    }
}