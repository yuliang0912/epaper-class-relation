/**
 * Created by yuliang on 2017/1/2.
 */

var userInfoService = require('../../proxy/service/user_info')
const apiUtils = require('../../libs/api_utils')

module.exports = {
    noAuths: ['updateUserPwdAndNameForAdmin'],
    updatePwd: function *() {
        var newPwd = this.checkQuery('newPwd').notEmpty().value;
        var oldPwd = this.checkQuery('oldPwd').notEmpty().value;
        this.errors && this.validateError();

        var userInfo = yield userInfoService.getUserInfo({userId: this.request.userId})

        if (!userInfo) {
            this.error('用户名和密码不匹配')
        }

        if (userInfo.PassWord !== apiUtils.crypto.sha512(oldPwd + userInfo.SaltValue).toUpperCase()) {
            this.error('用户名和密码不匹配')
        }

        var createdNewPwd = apiUtils.crypto.sha512(newPwd + userInfo.SaltValue).toUpperCase()

        yield userInfoService.updateUserInfo({PassWord: createdNewPwd}, {userId: this.request.userId})
            .then(this.success)
    },
    updateUserPwdAndNameForAdmin: function *() {
        var userId = this.checkQuery('userId').notEmpty().toInt().value;
        var newPwd = this.checkQuery('newPwd').default('').value;
        var realName = this.checkQuery('realName').default('').value;
        this.errors && this.validateError();

        if (newPwd === '' && realName === '') {
            this.error('参数newPwd和realName不能为空')
        }

        var userInfo = yield userInfoService.getUserInfo({userId: userId})

        if (!userInfo) {
            this.error('未找到指定用户')
        }

        var modiflyUser = {}
        if (newPwd !== '') {
            var createdNewPwd = apiUtils.crypto.sha512(newPwd + userInfo.SaltValue).toUpperCase()
            modiflyUser.PassWord = createdNewPwd
        }
        if (realName !== '') {
            modiflyUser.realName = decodeURIComponent(realName);
        }

        yield userInfoService.updateUserInfo(modiflyUser, {userId: userId})
            .then(this.success)
    }
}