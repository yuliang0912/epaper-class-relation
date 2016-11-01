/**
 * Created by yuliang on 2016/10/18.
 */

var classService = require('../../proxy/service/class_info')
var classMemberService = require('../../proxy/service/class_member')

module.exports = {
    getClassMembers: function *() {
        var classId = this.checkQuery('classId').toInt().value;
        var userRole = this.checkQuery('userRole').default(0).toInt().value;
        var keyWords = this.checkQuery('keyWords').default('').value;
        this.errors && this.validateError();

        yield classMemberService.getClassMembers(classId, userRole, keyWords)
            .then(this.success).catch(this.error)
    },
    getSchoolMembers: function *() {
        var brandId = this.checkQuery('brandId').toInt().value;
        var schoolIds = this.checkQuery('schoolIds').notEmpty().match(/^\d+(,\d+)*$/).value;
        var userRole = this.checkQuery('userRole').default(0).toInt().value;
        var keyWords = this.checkQuery('keyWords').default('').value;
        this.errors && this.validateError();

        schoolIds = schoolIds.split(',').map(item=>parseInt(item));

        yield classMemberService.getSchoolMembers(brandId, schoolIds, userRole, keyWords)
            .then(this.success).catch(this.error)
    },
    addClassMember: function *() {
        this.allow('POST').allowJson();
        var brandId = this.checkBody('brandId').notEmpty().toInt().value;
        var classId = this.checkBody('classId').notEmpty().toInt().value;
        var schoolId = this.checkBody('schoolId').notEmpty().toInt().value;
        var userId = this.checkBody('userId').default(0).toInt().value;
        var userName = this.checkBody('userName').notEmpty().value;
        var userRole = this.checkBody('userRole').notEmpty().in([1, 2]).toInt().value;
        var subjectId = this.checkBody('subjectId').default(0).toInt().value;
        var mobile = this.checkBody('mobile').default('').value;
        var initialPwd = this.checkBody('initialPwd').default('').value;
        var isMaster = this.checkBody('isMaster').default(0).toInt().value;
        this.errors && this.validateError();

        if (userId > 0 && userId < 10001) {
            this.error('userId不在取值范围之内')
        }

        var classInfo = yield classService.getClassInfo(classId)
        if (!classInfo) {
            this.error('参数错误,未找到指定的班级')
        }
        if (classInfo.status !== 0) {
            this.error('未找到指定的班级')
        }
        if (classInfo.schoolId != schoolId) {
            this.error('参数错误,classId与schoolId不匹配')
        }
        if (classInfo.brandId != brandId) {
            this.error('参数错误,brandId与classId不匹配')
        }

        var memberInfo = yield classMemberService.getMemberInfo(classId, userId)

        if (!memberInfo) {
            yield classMemberService.addClassMember(this.request.body)
                .then(id=>this.success(id > 0 ? 1 : 0)).catch(this.error);
        } else if (memberInfo.status === 0) {
            this.error('成员已经在该班级中.不能重复添加')
        } else {
            yield classMemberService.updateMemberStatus(memberInfo.id, memberInfo.classId, 0)
                .then(id=>this.success(id > 0 ? 1 : 0)).catch(this.error);
        }
    },
    removeClassMember: function *() {
        var brandId = this.checkQuery('brandId').notEmpty().toInt().value;
        var classId = this.checkQuery('classId').notEmpty().toInt().value;
        var schoolId = this.checkQuery('schoolId').notEmpty().toInt().value;
        var userId = this.checkQuery('userId').notEmpty().toInt().gt(10000).value;
        this.errors && this.validateError();

        yield classMemberService.removeClassMember(brandId, classId, schoolId, userId)
            .then(rows=> this.success(rows > 0 ? 1 : 0)).catch(this.error)
    },
    editMemberInfo: function *() {
        this.allow('POST').allowJson();
        var brandId = this.checkBody('brandId').notEmpty().toInt().value;
        var classId = this.checkBody('classId').notEmpty().toInt().value;
        var schoolId = this.checkBody('schoolId').notEmpty().toInt().value;
        var userId = this.checkBody('userId').notEmpty().toInt().gt(10000).value;
        var userName = this.checkBody('userName').default('').value;
        var userRole = this.checkBody('userRole').default(0).toInt().value;
        var subjectId = this.checkBody('subjectId').default(0).toInt().value;
        var mobile = this.checkBody('mobile').default('').value;
        var isMaster = this.checkBody('isMaster').default(-1).toInt().value;
        this.errors && this.validateError();

        var memberInfo = {brandId, classId, schoolId, userId, userName, userRole, subjectId, mobile, isMaster}
        yield classMemberService.updateClasMember(memberInfo)
            .then(rows=>this.success(rows > 0 ? 1 : 0)).catch(this.error)
    }
}


