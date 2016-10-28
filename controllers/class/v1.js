/**
 * Created by yuliang on 2016/9/30.
 */

var classInfoService = require('../../proxy/api_transform/class_info')
var schoolInfoService = require('../../proxy/api_transform/school_info')


module.exports = {
    noAuths: [],
    getClassInfo: function *() {
        var classId = this.checkQuery('classId').notEmpty().toInt().value;
        this.errors && this.validateError();
        yield classInfoService.getClassInfo(classId).then(this.success).catch(this.error)
    },
    createClass: function *() {
        this.allow('POST').allowJson();
        var className = this.checkBody('className').notEmpty().value;
        var schoolId = this.checkBody('schoolId').toInt().value;
        var grade = this.checkBody('grade').toInt().value;
        var brandId = this.checkBody('brandId').toInt().value;
        this.errors && this.validateError();

        var schoolInfo = (yield schoolInfoService.getSchoolInfo(schoolId)).toApiData();

        if (!schoolInfo) {
            this.error('未找到指定的学校', 101)
        }

        var classInfo = {
            className, schoolId, brandId, grade,
            schoolName: schoolInfo.schoolName,
            studentNum: 0,
            teacherNum: 0,
            createUserId: this.request.userId
        }

        yield classInfoService.createClass(classInfo).then(data=>this.success(data.classId)).catch(this.error)
    },
    deleteClass: function *() {
        var brandId = this.checkQuery('brandId').toInt().value;
        var classIds = this.checkQuery('classIds').notEmpty().match(/^\d+(,\d+)*$/).value;
        this.errors && this.validateError();

        classIds = classIds.split(',').map(item=>parseInt(item));

        yield classInfoService.deleteClass(brandId, classIds)
            .then(data=>this.success(data[0] > 0 ? 1 : 0)).catch(this.error)
    },
    updateClassGrade: function *() {
        var brandId = this.checkQuery('brandId').toInt().value;
        var gradeId = this.checkQuery('gradeId').toInt().value;
        var classIds = this.checkQuery('classIds').notEmpty().match(/^\d+(,\d+)*$/).value;
        this.errors && this.validateError();

        classIds = classIds.split(',').map(item=>parseInt(item));

        yield classInfoService.updateClassGrade(brandId, classIds, gradeId)
            .then(data=>this.success(data[0] > 0 ? 1 : 0)).catch(this.error)
    },
    getClassListBySchoolIds: function *() {
        var brandId = this.checkQuery('brandId').toInt().value;
        var schoolIds = this.checkQuery('schoolIds').notEmpty().match(/^\d+(,\d+)*$/).value;
        var period = this.checkQuery('period').default(0).toInt().value;
        var grade = this.checkQuery('grade').default(0).toInt().value;
        var page = this.checkQuery('page').toInt().gt(0).value;
        var pageSize = this.checkQuery('pageSize').toInt().gt(0).value;
        this.errors && this.validateError();

        schoolIds = schoolIds.split(',').map(item=>parseInt(item));

        yield classInfoService.getClassListBySchoolIds(brandId, schoolIds, period, grade, page, pageSize)
            .then(this.success).catch(this.error)

    }
}