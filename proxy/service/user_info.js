/**
 * Created by yuliang on 2017/1/2.
 */


"use strict"
const userKnex = require('../../configs/knex').userInfo

module.exports = {
    getUserInfo: function (condition) {
        return userKnex('user_info').select().where(condition).first()
    },
    updateUserInfo: function (model, condition) {
        return userKnex('user_info').update(model).where(condition)
    }
}
